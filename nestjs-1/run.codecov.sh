#!/bin/bash

if [[ -z "$CODECOV_TOKEN" ]]; then
  echo "Please set CODECOV_TOKEN."
  exit 1
fi

bash <(curl -s https://codecov.io/bash)
