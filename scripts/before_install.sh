#!/bin/bash

DIT="/home/ec2-user/backend-develop"
if [ -d "$DIR" ]; then
  cd /home/ec2-user
  sudo rm -rf backend-develop
else
  echo "Directory does not exist"
fi
