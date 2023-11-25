#!/bin/bash

aws s3 sync s3://socialiser-env-files/develop . # it will check for develop folder inside socialiser-env-files bucket and download all the content of the folder
unzip env-file.zip # because env file come to us in zip format
cp .env.production .env # copy .env.production file and create a new file .env
rm .env.production # delete .env.production
sed -i -e "s|\(^REDIS_HOST=\).*|REDIS_HOST=redis://$ELASTICACHE_ENDPOINT:6379|g" .env # update REDIS_HOST in the .env file, ELASTICACHE_ENDPOINT is specified in elasticache.tf file
rm -rf env-file.zip
cp .env .env.production
zip env-file.zip .env.production
aws --region ap-south-1 s3 cp env-file.zip s3://socialiser-env-files/develop/ # replace the file inside s3 bucket
rm -rf .env*
rm -rf env-file.zip

# here we will write a script to update the REDIS_HOST inside env file
# sync command is used to download the file content from the bucket, our env file will be inside the s3 bucket
