# igw: internet gateway
# Here we will create a public internet gateway, attach it to the vpc
resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-vpc-igw" })
  )
}
