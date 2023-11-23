# we need to create elastic ip to create NAT gateway then we create private route and associate them to private subnet
# if we create elastic ip not associate it to anything then we'll be charged and if we do associate it then we will not be charged
resource "aws_eip" "elastic_ip" {
  depends_on = [
    aws_internet_gateway.main_igw
  ]

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-eip"})
  )
}
