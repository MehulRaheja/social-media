#!/bin/bash

ASG=$(aws autoscaling describe-auto-scaling-groups --no-paginate --output text --query "AutoScalingGroups[? Tags[? (Key=='Type') && Value=='$ENV_TYPE']]".AutoScalingGroupName)
aws autoscaling delete-auto-scaling-group --auto-scaling-group-name $ASG --force-delete

# autoscaling group(ASG) is created by codedeploy, so we don't know the name of it and because of that terraform is not able to delete it.
# to delete the ASG, we need to get the name through shell script and then delete the ASG
