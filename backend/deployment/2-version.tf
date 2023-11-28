# This file is for our terraform provider and in our case it is AWS

terraform {
  required_version = "~> 1.6.4" # minimum required version, changed from 1.2.0 to 1.6.4
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# aws key and secret can also be specified here
provider "aws" {
  region = var.aws_region
}
