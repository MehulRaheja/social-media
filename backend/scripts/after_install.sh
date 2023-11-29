#!/bin/bash

cd /home/ec2-user/socialiser-backend
sudo rm -rf env-file.zip
sudo rm -rf .env
sudo rm -rf .env.develop
aws s3 sync s3://socialiser-env-files/develop .
unzip env-file.zip
sudo cp .env.develop .env
sudo pm2 delete all
sudo npm install
