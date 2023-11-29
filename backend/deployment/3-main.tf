# here we will specified our backend and some local variables to use

terraform {
  backend "s3" {
    bucket  = "socialiser-terraform-state"
    key     = "develop/socialiser.tfstate" # in the s3 bucket it will go inside develop directory and create socialiser.tfstate file
    region  = "ap-south-1"                 # variable does not work here
    encrypt = true                         # encryption of the s3 state is enabled
  }
}

# if we don't define a workspace, terraform will take a default workspace
locals {
  prefix = "${var.prefix}-${terraform.workspace}"

  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Mehul Raheja"
  }
}
