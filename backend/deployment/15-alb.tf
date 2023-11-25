# for application load balancer we need some listners: https listener and http listener and http direct to https
resource "aws_alb" "application_load_balancer" {
  name = "${local.prefix}-alb"
  load_balancer_type = "application"
  internal = false
  subnets = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
  security_groups = [aws_security_group.alb_sg.id]
  enable_deletion_protection = false # here false means if we want to terminate the load balancer then terraform will be able to delete it, default vaulue is false
  ip_address_type = "ipv4"
  idle_timeout = 300 # if application is idle for 5 minutes then load balancer will go to sleep

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-ALB"})
  )
}

resource "aws_alb_listener" "alb_https_listener" {
  load_balancer_arn = aws_alb.application_load_balancer.arn
  port = 443
  protocol = "HTTPS"
  ssl_policy = var.https_ssl_policy
  certificate_arn = aws_acm_certificate_validation.cert_validation.certificate_arn

  depends_on = [
    aws_acm_certificate_validation.cert_validation
  ]

  default_action {
    type = "forward"
    target_group_arn = aws_alb_target_group.server_backend_tg.arn
  }
}

resource "aws_alb_listener" "alb_http_listener" {
  load_balancer_arn = aws_alb.application_load_balancer.arn
  port = 80
  protocol = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port = 443
      protocol = "HTTPS"
      status_code = "HTTP_301" # this code is for redirection
    }
  }
}

resource "aws_alb_listener_rule" "alb_https_listener_rule" {
  listener_arn = aws_alb_listener.alb_http_listener.arn
  priority = 100
  action {
    type = "forward"
  }

  condition {
    path_pattern {
      values = ["/*"] # here we can set redirection rule for e.g. if we have different target groups because of microservices, we can specify here which request will redirect to where. but in our case we have only one service
    }
  }
}
