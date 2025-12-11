#!/bin/bash

VERSION=""

# get parameters
while getopts v: flag
do
  case "${flag}" in
    v) VERSION=${OPTARG};;
  esac
done

# get highest tag number and add v0.1.0 if it doesn't exist
git fetch --prune --unshallow 2>/dev/null

CURRENT_VERSION=$(git describe --abbrev=0 --tags 2>/dev/null)

if [[ -z "$CURRENT_VERSION" ]]; then
  CURRENT_VERSION="v0.1.0"
fi

echo "Current version: $CURRENT_VERSION"

# remove the 'v'
CURRENT_VERSION="${CURRENT_VERSION#v}"

# replace dots with space so we can split into array
CURRENT_VERSION_PARTS=(${CURRENT_VERSION//./ })

# get number parts
VNUM1=${CURRENT_VERSION_PARTS[0]}
VNUM2=${CURRENT_VERSION_PARTS[1]}
VNUM3=${CURRENT_VERSION_PARTS[2]}

# bump version based on input
if [[ "$VERSION" == "major" ]]; then
  VNUM1=$((VNUM1+1))
  VNUM2=0
  VNUM3=0

elif [[ "$VERSION" == "minor" ]]; then
  VNUM2=$((VNUM2+1))
  VNUM3=0

elif [[ "$VERSION" == "patch" ]]; then
  VNUM3=$((VNUM3+1))

else
  echo "Incorrect type. Use: -v [major | minor | patch]"
  exit 1
fi

# create new tag
NEW_TAG="v$VNUM1.$VNUM2.$VNUM3"
echo "($VERSION) updating $CURRENT_VERSION to $NEW_TAG"

# get current commit hash
GIT_COMMIT=$(git rev-parse HEAD)
NEEDS_TAG=$(git describe --contains $GIT_COMMIT 2>/dev/null)

# only tag if no tag already exists
if [[ -z "$NEEDS_TAG" ]]; then
  echo "Tagging $NEW_TAG"
  git tag "$NEW_TAG"
  git push --tags
  git push
else
  echo "This commit already has a tag ($NEEDS_TAG)"
fi

# GitHub output
echo "::set-output name=git-tag::$NEW_TAG"

exit 0
