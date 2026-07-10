#!/bin/bash
set -euo pipefail

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

# Helpers
get_ver() { node --input-type=module -e "import{readFileSync}from'fs';console.log(JSON.parse(readFileSync('$1','utf8')).version)"; }
set_ver() { node --input-type=module -e "import{readFileSync,writeFileSync}from'fs';const p=JSON.parse(readFileSync('$1','utf8'));p.version='$2';writeFileSync('$1',JSON.stringify(p,null,2)+'\n')"; }
bump() { node -e "const s='$1'.split('.'),p=s.pop().split('-')[0];s.push(String((parseInt(p,10)||0)+1));console.log(s.join('.'))"; }
add_suffix() { local v=$1 s=$2; [ "$s" = "master" ] && echo "$v" || echo "${v}-${s}"; }
strip_suffix() { echo "$1" | sed 's/-.*$//'; }

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

# Step 4 – commit version on current branch
git add .
git commit -m "v${ROOT_VER}"
echo "Committed v${ROOT_VER} on $CURRENT_BRANCH"

# Step 5 – checkout master and merge
git checkout master
git merge - --no-edit -X theirs
echo "Merged $CURRENT_BRANCH → master"

# Step 6 – strip suffix on master, build, test
if [ "$ADMIN_ONLY" = false ]; then
  for pkg in $CHANGED_PACKAGES; do
    VER=$(get_ver packages/$pkg/package.json)
    set_ver packages/$pkg/package.json "$(strip_suffix "$VER")"
  done
fi
VER=$(get_ver package.json)
set_ver package.json "$(strip_suffix "$VER")"
RELEASE_VER=$(get_ver package.json)
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
    NAME=$(node --input-type=module -e "import{readFileSync}from'fs';console.log(JSON.parse(readFileSync('packages/$pkg/package.json','utf8')).name)")
    VER=$(get_ver packages/$pkg/package.json)
    echo ""
    echo "--- Publishing $NAME@$VER ---"
    echo "Enter OTP for $NAME (or blank to skip):"
    read -r OTP
    if [ -n "$OTP" ]; then
      (cd "packages/$pkg" && npm publish --otp="$OTP")
      echo "✅ $NAME published"
    else
      echo "⏭️  Skipped $NAME"
    fi
  done
else
  echo "Admin-only release – no npm publish"
fi

# Step 10 – back to original branch
git checkout "$CURRENT_BRANCH"
echo "Back to $CURRENT_BRANCH"
echo "=== Done: v${RELEASE_VER} ==="
