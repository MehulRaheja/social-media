# if we create NAT gateway then we will be charged
# NAT: Network Address Translation is a service which an instance in private subnet can use to connect to services in other VPCs, on-premises networks, or the internet.
# even though we are using 2 availability zones but we will create only one nat gateway because it is a paid service and associate it to only 1 availability zone
resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.elastic_ip.id
  subnet_id = aws_subnet.public_subnet_a.id

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-nat-gw"})
  )
}
