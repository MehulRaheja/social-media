variable "aws_region" {
  description = "Region in which AWS resources are created"
  type        = string
  default     = "ap-south-1"
}

# vpc_cidr_block: it is just a way to assign ip addresses to the vpc (it specifies a range),
# raseon we choose 10.0.0.0/16 because it has lot of ips available
variable "vpc_cidr_block" {
  description = "VPC CIDR Block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_availability_zones" {
  description = "VPC Availability Zones"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "vpc_public_subnets" {
  description = "VPC Public Subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "vpc_private_subnets" {
  description = "VPC Private Subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

# cidr block for all ips
# 0.0.0.0/0 means it will allow traffic from all ips
variable "global_destination_cidr_block" {
  description = "CIDR Block for all IPs"
  type        = string
  default     = "0.0.0.0/0"
}

# bastion_host is just a ec2 instance from which we got access to our services inside the private subnet
variable "bastion_host_cidr" {
  description = "CIDR Block for Bastion Host Ingress"
  type        = string
  default     = "0.0.0.0/0" #only for testing purposes, replace with bastion_host ip before deployment
}

# ELBSecurityPolicy-2016-08 is the ssl policy from aws which we are going to use
variable "https_ssl_policy" {
  description = "HTTPS SSL Policy"
  type        = string
  default     = "ELBSecurityPolicy-2016-08"
}

variable "main_api_server_domain" {
  description = "Main API Server Domain"
  type        = string
  default     = "socialiser.xyz"
}

variable "dev_api_server_domain" {
  description = "Dev API Server Domain"
  type        = string
  default     = "api.stg.socialiser.xyz"
}

variable "ec2_iam_role_name" {
  description = "EC2 IAM Role Name"
  type        = string
  default     = "socialiser-server-ec2-role"
}

variable "ec2_iam_role_policy_name" {
  description = "EC2 IAM Role Policy Name"
  type        = string
  default     = "socialiser-server-ec2-role-policy"
}

variable "ec2_instance_profile_name" {
  description = "EC2 Instance Profile Name"
  type        = string
  default     = "socialiser-server-ec2-instance-profile"
}

# this is the type of the machine that we will use for the elastic cache
# and we will specify very small machine because we will destroy it right after testing after the deployment
variable "elasticache_node_type" {
  description = "Elasticache Node Type"
  type        = string
  default     = "cache.t2.micro"
}

variable "elasticache_parameter_group_name" {
  description = "Elasticache Parameter Group Name"
  type        = string
  default     = "default.redis7"
}

# t2.medium is not under free tier, use wisely
variable "ec2_instance_type" {
  description = "EC2 Instance Type"
  type        = string
  default     = "t2.medium"
}

# it requires a small machine so t2.micro is enough
variable "bastion_host_type" {
  description = "Bastion Instance Type"
  type        = string
  default     = "t2.micro"
}

variable "code_deploy_role_name" {
  description = "CodeDeploy IAM Role"
  type        = string
  default     = "socialiser-server-codedeploy-role"
}

# e.g. for vpc it will be socialiser-server-vpc
variable "prefix" {
  description = "Prefix to be added to AWS resources tags"
  type        = string
  default     = "socialiser-server"
}

variable "project" {
  description = "Prefix to be added to AWS resources local tags"
  type        = string
  default     = "socialiser-server"
}
