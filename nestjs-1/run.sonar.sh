#!/bin/bash

set -e

if [[ -z "$SONARCLOUD_TOKEN" ]]; then
  echo "Please set SONARCLOUD_TOKEN."
  exit 1
fi

# For local purpose it should use current git branch, on CI it should use circleCI branch
[[ ! -z "$CIRCLE_BRANCH" ]] && BRANCH="${CIRCLE_BRANCH}" || BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Detected Branch: '$BRANCH'"

# Project base dir is needed for dockerized execution
sonar-scanner -X -Dsonar.branch.name="$BRANCH" -Dproject.settings=./sonar.properties -Dsonar.projectBaseDir=$(pwd)
