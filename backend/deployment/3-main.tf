
terraform {
  backend "s3" {
    bucket  = "socialiser-terraform-state"
    key     = "develop/socialiser.tfstate"
    region  = "ap-south-1"
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"

  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Mehul Raheja"
  }
}
