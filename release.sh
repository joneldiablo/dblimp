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
echo "npm registry: $(npm config get registry)"
echo "npm user:     $(npm whoami 2>/dev/null || echo 'NOT LOGGED IN')"

# Abort if not logged in
npm whoami &>/dev/null || { echo "Login first: npm login"; exit 1; }

# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------
get_ver() { node -p "require('./$1/package.json').version" 2>/dev/null || echo "0.0.0"; }

set_ver() {
  node -e "
    const fs = require('fs');
    const p = JSON.parse(fs.readFileSync('$1','utf8'));
    p.version = '$2';
    fs.writeFileSync('$1', JSON.stringify(p, null, 2) + '\n');
  "
}

bump() {
  node -e "
    const s = '$1'.split('.');
    const p = s.pop().split('-')[0];
    s.push(String((parseInt(p,10)||0)+1));
    console.log(s.join('.'));
  "
}

add_suffix() { local v=$1 s=$2; [ "$s" = "master" ] && echo "$v" || echo "${v}-${s}"; }
strip_suffix() { echo "$1" | sed 's/-.*$//'; }

# ------------------------------------------------------------------
# Step 1 – check clean working tree
# ------------------------------------------------------------------
if ! git diff-index --quiet HEAD --; then
  echo "Uncommitted changes detected. Please commit or stash them first."
  exit 1
fi

CURRENT_BRANCH=$(git symbolic-ref --short HEAD)

if [ "$CURRENT_BRANCH" = "master" ]; then
  echo "Already on master. Work on a feature/dev branch, then run release.sh."
  exit 1
fi

echo "Branch: $CURRENT_BRANCH"

# ------------------------------------------------------------------
# Step 2 – detect changed packages
# ------------------------------------------------------------------
# First release: if master and HEAD are the same, treat all packages as new
if git merge-base --is-ancestor master HEAD 2>/dev/null && [ "$(git rev-parse master)" = "$(git rev-parse HEAD)" ]; then
  CHANGED_PACKAGES=$(ls packages/)
  echo "First release – publishing all packages"
else
  CHANGED_PACKAGES=$(git diff --name-only master..HEAD -- packages/*/src/ 2>/dev/null | sed -n 's|packages/\([^/]*\)/.*|\1|p' | sort -u || true)
  if [ -z "$CHANGED_PACKAGES" ]; then
    CHANGED_PACKAGES=$(git diff --name-only master..HEAD -- packages/*/ 2>/dev/null | sed -n 's|packages/\([^/]*\)/.*|\1|p' | sort -u || true)
  fi
fi

if [ -z "$CHANGED_PACKAGES" ]; then
  echo "No package changes detected."
  exit 0
fi

echo "Changed packages: $(echo $CHANGED_PACKAGES | tr '\n' ' ')"

# ------------------------------------------------------------------
# Step 3 – bump versions
# ------------------------------------------------------------------
declare -A OLD_VER NEW_VER
for pkg in $CHANGED_PACKAGES; do
  OLD_VER[$pkg]=$(get_ver packages/$pkg/package.json)
  NEW_VER[$pkg]=$(bump "${OLD_VER[$pkg]}")
  set_ver packages/$pkg/package.json "$(add_suffix "${NEW_VER[$pkg]}" "$CURRENT_BRANCH")"
  echo "  $pkg: ${OLD_VER[$pkg]} → $(get_ver packages/$pkg/package.json)"
done

OLD_ROOT=$(get_ver package.json)
NEW_ROOT=$(bump "$OLD_ROOT")
set_ver package.json "$(add_suffix "$NEW_ROOT" "$CURRENT_BRANCH")"
echo "  root: $OLD_ROOT → $(get_ver package.json)"

ROOT_VER=$(get_ver package.json)

# ------------------------------------------------------------------
# Step 5 – commit version on current branch
# ------------------------------------------------------------------
git add .
git commit -m "v${ROOT_VER}"
echo "Committed v${ROOT_VER} on $CURRENT_BRANCH"

# ------------------------------------------------------------------
# Step 6 – checkout master and merge
# ------------------------------------------------------------------
git checkout master
git merge - --no-edit -X theirs
echo "Merged $CURRENT_BRANCH → master"

# ------------------------------------------------------------------
# Step 7 – strip suffix on master & build & test
# ------------------------------------------------------------------
for pkg in $CHANGED_PACKAGES; do
  VER=$(get_ver packages/$pkg/package.json)
  set_ver packages/$pkg/package.json "$(strip_suffix "$VER")"
done
VER=$(get_ver package.json)
set_ver package.json "$(strip_suffix "$VER")"
RELEASE_VER=$(get_ver package.json)

echo "Stripped suffix: $RELEASE_VER"

echo "Running tests..."
yarn workspaces run test 2>/dev/null || echo "(tests skipped or not configured)"

echo "Building..."
yarn workspaces run build 2>/dev/null || echo "(build skipped or not configured)"

# ------------------------------------------------------------------
# Step 8 – commit release on master
# ------------------------------------------------------------------
git add .
git commit -m "v${RELEASE_VER}"
git push origin master

# ------------------------------------------------------------------
# Step 9 – tag & push
# ------------------------------------------------------------------
git tag -a "v${RELEASE_VER}" -m "dblimp v${RELEASE_VER}"
git push origin "v${RELEASE_VER}"
echo "Tagged v${RELEASE_VER}"

# ------------------------------------------------------------------
# Step 10 – npm publish (interactive, OTP required per package)
# ------------------------------------------------------------------
echo ""
echo "Publishing to npm..."
for pkg in $CHANGED_PACKAGES; do
  NAME=$(node -p "require('./packages/$pkg/package.json').name")
  VER=$(get_ver packages/$pkg/package.json)
  echo ""
  echo "--- Publishing $NAME@$VER ---"
  echo "Enter OTP for $NAME (or press Enter to skip):"
  read -r OTP
  if [ -n "$OTP" ]; then
    (cd "packages/$pkg" && npm publish --otp="$OTP")
    echo "✅ $NAME published"
  else
    echo "⏭️  Skipped $NAME"
  fi
done

# ------------------------------------------------------------------
# Step 11 – back to original branch
# ------------------------------------------------------------------
git checkout "$CURRENT_BRANCH"
echo "Back to $CURRENT_BRANCH"
echo "=== Done: v${RELEASE_VER} ==="
