#!/bin/bash

# this function checks the program we are looking for is already installed or not
# it will return 1 if program exists and 0 otherwise
function program_is_installed {
  local return_=1

  type $1 >/dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}

# this command uses root user and not iam user, so we need to use sudo
sudo yum update -y

# checking if nodejs is installed. If not, install it
if [ $(program_is_installed node) == 0 ]; then
  curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
  sudo yum install -y nodejs
fi

if [ $(program_is_installed git) == 0 ]; then
  sudo yum install git -y
fi

if [ $(program_is_installed docker) == 0 ]; then
  sudo amazon-linux-extras install docker -y
  sudo systemctl start docker
  sudo docker run --name socialiser-redis -p 6379:6379 --restart always --detach redis # to start redis
fi

if [ $(program_is_installed pm2) == 0 ]; then
  npm install -g pm2 # add this point node is installed so we have access to npm
fi

cd /home/ec2-user

git clone -b development https://github.com/MehulRaheja/social-media.git # we are taking clone from the development branch, if the environment is staging or prod then we take clone from respective branch
cd social-media/backend
npm install
aws s3 sync s3://socialiser-env-files/develop . # it will check for develop folder inside socialiser-env-files bucket and download all the content of the folder
unzip env-file.zip # because env file come to us in zip format
cp .env.production .env # copy .env.production file and create a new file .env
npm run build
npm run start
