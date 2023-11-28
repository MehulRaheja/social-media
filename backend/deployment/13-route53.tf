# This is route53 resource
# HOSTED ZONE IS NOT FREE
# we have created hosted zone manually so we need to tell terraform how to get and use it for that 'data' property will be used
# get your already created hosted zone
data "aws_route53_zone" "main" {
  name         = var.main_api_server_domain
  private_zone = false # we have created a public zone
}
