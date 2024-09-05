#!/bin/bash

DIT="/home/ec2-user/socialiser-backend"
if [ -d "$DIR" ]; then
  cd /home/ec2-user
  sudo rm -rf socialiser-backend
else
  echo "Directory does not exist"
fi
