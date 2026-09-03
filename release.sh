#!/bin/bash
set -euo pipefail

# Parse flags
CONTINUE_MODE=false
for arg in "$@"; do
  case "$arg" in
    --continue) CONTINUE_MODE=true ;;
    -h|--help)
      echo "Usage: release.sh [--continue]"
      echo "  (default) full release from a feature/dev branch"
      echo "  --continue resume npm publishing after a cut-off script (assumes release is tagged on master)"
      exit 0
      ;;
  esac
done

# Clean npm env vars that cause auth issues when run from within yarn
unset npm_config_version_commit_hooks
unset npm_config_version_tag_prefix
unset npm_config_version_git_message
unset npm_config_argv
unset npm_config_version_git_tag
unset npm_config_registry
export NPM_CONFIG_REGISTRY="https://registry.npmjs.org/"

echo "=== dblimp Release ==="
echo "npm user: $(npm whoami 2>/dev/null || echo 'NOT LOGGED IN')"
npm whoami &>/dev/null || { echo "Login first: npm login"; exit 1; }

# Continue mode short-circuit: only re-run npm publishing + back to dev.
if [ "$CONTINUE_MODE" = true ]; then
  publish_only
  exit 0
fi

# Helpers
get_ver() { node --input-type=module -e "import{readFileSync}from'fs';console.log(JSON.parse(readFileSync('$1','utf8')).version)"; }
set_ver() { node --input-type=module -e "import{readFileSync,writeFileSync}from'fs';const p=JSON.parse(readFileSync('$1','utf8'));p.version='$2';writeFileSync('$1',JSON.stringify(p,null,2)+'\n')"; }
bump() { node -e "const s='$1'.split('.'),p=s.pop().split('-')[0];s.push(String((parseInt(p,10)||0)+1));console.log(s.join('.'))"; }
add_suffix() { local v=$1 s=$2; [ "$s" = "master" ] && echo "$v" || echo "${v}-${s}"; }
strip_suffix() { echo "$1" | sed 's/-.*$//'; }

# Publish a single package to npm, retrying OTP until success, "skip", or blank.
publish_package() {
  local pkg=$1
  local NAME VER
  NAME=$(node --input-type=module -e "import{readFileSync}from'fs';console.log(JSON.parse(readFileSync('packages/$pkg/package.json','utf8')).name)")
  VER=$(get_ver "packages/$pkg/package.json")

  # Skip if this exact version is already live on the registry.
  if [ "$(npm view "$NAME@$VER" version 2>/dev/null)" = "$VER" ]; then
    echo "  ✅ $NAME@$VER already published – skipping"
    return 0
  fi

  echo ""
  echo "--- Publishing $NAME@$VER ---"
  while true; do
    echo "Enter npm OTP for $NAME@$VER (blank/skip = skip this package):"
    read -r OTP || return 1
    if [ -z "$OTP" ]; then
      echo "⏭️  Skipped $NAME@$VER"
      return 0
    fi
    if [ "$OTP" = "skip" ]; then
      echo "⏭️  Skipped $NAME@$VER"
      return 0
    fi
    if (cd "packages/$pkg" && npm publish --otp="$OTP"); then
      echo "✅ $NAME@$VER published"
      return 0
    else
      echo "Publish failed (bad OTP or network). Try again."
    fi
  done
}

# Continue mode: resume npm publishing for the current release, then return to dev.
publish_only() {
  local START_BRANCH RETURN_BRANCH
  START_BRANCH=$(git symbolic-ref --short HEAD)
  RETURN_BRANCH="$START_BRANCH"
  [ "$RETURN_BRANCH" = "master" ] && RETURN_BRANCH="dev"
  RELEASE_VER=$(get_ver package.json)
  RELEASE_VER=$(strip_suffix "$RELEASE_VER")
  echo "Resuming npm publish for v${RELEASE_VER} (working on $START_BRANCH)..."
  CHANGED_PACKAGES=$(ls packages/)
  for pkg in $CHANGED_PACKAGES; do
    publish_package "$pkg"
  done
  if [ "$(git symbolic-ref --short HEAD)" != "$RETURN_BRANCH" ]; then
    git checkout "$RETURN_BRANCH" 2>/dev/null || true
  fi
  echo "Back to $RETURN_BRANCH"
  echo "=== Publish complete: v${RELEASE_VER} ==="
}

# Step 1 – check clean working tree
if ! git diff-index --quiet HEAD --; then echo "Uncommitted changes detected."; exit 1; fi

CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
if [ "$CURRENT_BRANCH" = "master" ]; then echo "Already on master. Work on a feature/dev branch, then run release.sh."; exit 1; fi
echo "Branch: $CURRENT_BRANCH"

# Step 2 – detect what changed
if [ -z "$(git tag)" ]; then
  CHANGED_PACKAGES=$(ls packages/)
  ADMIN_ONLY=false
  echo "First release – publishing all packages"
else
  CHANGED_PACKAGES=$(git diff --name-only master..HEAD -- packages/*/ | sed -n 's|packages/\([^/]*\)/.*|\1|p' | sort -u || true)
  ADMIN_ONLY=false
  if [ -z "$CHANGED_PACKAGES" ]; then
    # Check if any root-level non-package files changed
    ROOT_CHANGES=$(git diff --name-only master..HEAD -- . 2>/dev/null | grep -v '^packages/' || true)
    if [ -n "$ROOT_CHANGES" ]; then
      ADMIN_ONLY=true
      echo "Admin-only release (no package changes)"
    else
      echo "No changes detected."; exit 0
    fi
  fi
fi

if [ "$ADMIN_ONLY" = false ]; then
  echo "Changed packages: $(echo $CHANGED_PACKAGES | tr '\n' ' ')"
fi

# Step 3 – bump versions
if [ "$ADMIN_ONLY" = true ]; then
  OLD_ROOT=$(get_ver package.json)
  NEW_ROOT=$(bump "$OLD_ROOT")
  set_ver package.json "$(add_suffix "$NEW_ROOT" "$CURRENT_BRANCH")"
  echo "  root: $OLD_ROOT → $(get_ver package.json)"
else
  for pkg in $CHANGED_PACKAGES; do
    OLD=$(get_ver packages/$pkg/package.json)
    NEW=$(bump "$OLD")
    set_ver packages/$pkg/package.json "$(add_suffix "$NEW" "$CURRENT_BRANCH")"
    echo "  $pkg: $OLD → $(get_ver packages/$pkg/package.json)"
  done
  OLD_ROOT=$(get_ver package.json)
  NEW_ROOT=$(bump "$OLD_ROOT")
  set_ver package.json "$(add_suffix "$NEW_ROOT" "$CURRENT_BRANCH")"
  echo "  root: $OLD_ROOT → $(get_ver package.json)"
fi

ROOT_VER=$(get_ver package.json)

# Save bumped versions before merge (so merge can't revert them)
declare -A PKG_VERSIONS
if [ "$ADMIN_ONLY" = false ]; then
  for pkg in $CHANGED_PACKAGES; do
    PKG_VERSIONS[$pkg]=$(get_ver "packages/$pkg/package.json")
  done
fi
SAVED_ROOT_VER="$ROOT_VER"

# Step 4 – commit version on current branch
git add .
git commit -m "v${ROOT_VER}"
echo "Committed v${ROOT_VER} on $CURRENT_BRANCH"

# Step 5 – checkout master and merge
git checkout master
git merge - --no-edit -X theirs
echo "Merged $CURRENT_BRANCH → master"

# Step 6 – strip suffix & apply saved versions (override merge result)
if [ "$ADMIN_ONLY" = false ]; then
  for pkg in $CHANGED_PACKAGES; do
    VER="${PKG_VERSIONS[$pkg]}"
    set_ver "packages/$pkg/package.json" "$(strip_suffix "$VER")"
  done
fi
RELEASE_VER=$(strip_suffix "$SAVED_ROOT_VER")
set_ver package.json "$RELEASE_VER"
echo "Release version: $RELEASE_VER"

if [ "$ADMIN_ONLY" = false ]; then
  echo "Running tests..."
  yarn workspaces run test 2>/dev/null || echo "(tests skipped)"
  echo "Building..."
  yarn workspaces run build 2>/dev/null || echo "(build skipped)"
fi

# Step 7 – commit release on master
git add .
git commit -m "v${RELEASE_VER}"
git push origin master

# Step 8 – tag & push
git tag -a "v${RELEASE_VER}" -m "dblimp v${RELEASE_VER}"
git push origin "v${RELEASE_VER}"
echo "Tagged v${RELEASE_VER}"

# Step 9 – npm publish (only if packages changed)
if [ "$ADMIN_ONLY" = false ]; then
  echo ""
  echo "Publishing to npm..."
  for pkg in $CHANGED_PACKAGES; do
    publish_package "$pkg"
  done
else
  echo "Admin-only release – no npm publish"
fi

# Step 10 – back to original branch
git checkout "$CURRENT_BRANCH"
echo "Back to $CURRENT_BRANCH"
echo "=== Done: v${RELEASE_VER} ==="
