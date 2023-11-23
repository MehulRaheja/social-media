# it is to protect our instances and allow only certain access which we allow
# inbound rules(ingress) allows the traffic into the resource
# outbound rules(egress) allows the traffic out of the resource and we want all the traffic to go out of the resource
# we need security group for the bastion host, application load balancer(ALB), autoscaling group(ASG), ElasticCache, security group added to the ASG will be automatically added to the instance created by that ASG
# bastion host is an ec2 instance that is use to access the EC2 instance and elastic cache inside the private subnet
resource "aws_security_group" "bastion_host_sg" {
  name = "${local.prefix}-bastion-host-sg"
  description = "Allows SSH into bastion host instance" # http, https are not allowed
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 22 # port for ssh
    to_port = 22 # port for ssh
    protocol = "TCP"
    cidr_blocks = [var.bastion_host_cidr]
    description = "Allows SSH into bastion host instance"
  }

  egress {
    from_port = 0 # universal port to allow all the outgoing traffic
    to_port = 0 # universal port to allow all the outgoing traffic
    protocol = "-1"
    cidr_blocks = [var.bastion_host_cidr]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-bastion-host-sg"})
  )
}

resource "aws_security_group" "alb_sg" {
  name = "${local.prefix}-alb-sg"
  description = "Allows traffic through the application load balancer" # http, https are allowed
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 80 # port for http
    to_port = 80 # port for http
    protocol = "TCP"
    cidr_blocks = [var.global_destination_cidr_block] # we want our application to be accessible through anywhere, that's why we use global cidr block and not any specific cidr block
    description = "Allows HTTP traffic to load balancer"
  }

  ingress {
    from_port = 443 # port for https
    to_port = 443 # port for https
    protocol = "TCP"
    cidr_blocks = [var.global_destination_cidr_block] # we want our application to be accessible through anywhere, that's why we use global cidr block and not any specific cidr block
    description = "Allows HTTPS traffic to load balancer"
  }

  egress {
    from_port = 0 # universal port to allow all the outgoing traffic
    to_port = 0 # universal port to allow all the outgoing traffic
    protocol = "-1"
    cidr_blocks = [var.bastion_host_cidr]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-alb-sg"})
  )
}

resource "aws_security_group" "autoscaling_group_sg" {
  name = "${local.prefix}-alb-sg"
  description = "Allows internet access for instances launched with ASG" # http, https and ssh are allowed, ssh is allowed because traffic that is coming from bastion instance will be ssh
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 80 # port for http
    to_port = 80 # port for http
    protocol = "TCP"
    security_groups = [aws_security_group.alb_sg.id] # here we only allow traffic that is passing through the autoscaling group
    description = "Allows HTTP traffic webserver"
  }

  ingress {
    from_port = 443 # port for https
    to_port = 443 # port for https
    protocol = "TCP"
    security_groups = [aws_security_group.alb_sg.id] # here we only allow traffic that is passing through the autoscaling group
    description = "Allows HTTPS traffic webserver"
  }

  ingress {
    from_port = 22 # port for ssh
    to_port = 22 # port for ssh
    protocol = "TCP"
    security_groups = [aws_security_group.bastion_host_sg.id] # we want ssh traffic to only come through bastion host
    description = "Allows access to webserver through bastion host"
  }

  ingress {
    from_port = 5000 # port of our backend
    to_port = 5000 # port of our backend
    protocol = "TCP"
    security_groups = [aws_security_group.alb_sg.id] # we want ssh traffic to only come through bastion host
    description = "Allows access to webserver through ALB"
  }

  egress {
    from_port = 0 # universal port to allow all the outgoing traffic
    to_port = 0 # universal port to allow all the outgoing traffic
    protocol = "-1"
    cidr_blocks = [var.bastion_host_cidr]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-autoscaling-group-sg"})
  )
}

resource "aws_security_group" "elasticache_sg" {
  name = "${local.prefix}-alb-sg"
  description = "Allows access to elasticache service"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 6379 # port of the redis server
    to_port = 6379 # port of the redis server
    protocol = "TCP"
    security_groups = [aws_security_group.bastion_host_sg.id] # access to the elastic cache is only allowed through bastion host
    description = "Allows access to redis server through bastion host"
  }

  ingress { # this rule is not necessary
    from_port = 6379 # port of the redis server
    to_port = 6379 # port of the redis server
    protocol = "TCP"
    security_groups = [aws_security_group.autoscaling_group_sg.id] # access to the elastic cache is only allowed through ASG(autoscaling group)
    description = "Allows access to redis server through ASG"
  }

  egress {
    from_port = 0 # universal port to allow all the outgoing traffic
    to_port = 0 # universal port to allow all the outgoing traffic
    protocol = "-1"
    cidr_blocks = [var.bastion_host_cidr]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-elasticache-sg"})
  )
}
