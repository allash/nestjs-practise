#!/bin/bash

set -e

export AWS_ACCESS_KEY_ID='mock'
export AWS_SECRET_ACCESS_KEY='mock'
BUCKET_NAME=$1

echo "Installing AWS cli applicaiton"
sudo apt-get install python-pip python-dev
sudo pip install awscli

echo "Creating bucket ${BUCKET_NAME} for testing"
aws --endpoint-url=http://localhost:4572 s3 mb s3://${BUCKET_NAME}

