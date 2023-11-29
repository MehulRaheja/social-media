# Here we will create a public route table
# public route table needs to be attach to public subnet
# we are going to create a route table and a separate route resource and another route table association resource
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-public-RT" })
  )
}

resource "aws_route" "public_igw_route" {
  route_table_id         = aws_route_table.public_route_table.id
  destination_cidr_block = var.global_destination_cidr_block
  gateway_id             = aws_internet_gateway.main_igw.id
  depends_on = [                       # depends_on is optional and use to add condition
    aws_route_table.public_route_table # we added a condition that aws_route_table.public_route_table is required to create aws_route(this route)
  ]
}

resource "aws_route_table_association" "public_subnet_1_association" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_subnet_2_association" {
  subnet_id      = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id
}
