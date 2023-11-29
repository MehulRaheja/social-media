# before we create load balancer, we need a target group for it.
resource "aws_alb_target_group" "server_backend_tg" {
  name                 = "${local.prefix}-tg"
  vpc_id               = aws_vpc.main.id
  port                 = 5000 # API server port
  protocol             = "HTTP"
  deregistration_delay = 60 # waiting time after the resource fails, means if the health check fails then after this much seconds our resource will terminate the process and start again

  health_check {
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    healthy_threshold   = 2  # how many health checks are done before instance is considered as healthy
    unhealthy_threshold = 10 # how many consecutive health checks are required to be failed for an instance to be considered as unhealthy
    # we will set a high value for it because we will be doing a lot of installation on the server before it is actually ready so health checks might fails even if the process is going right
    interval = 120   # time (in sec) between two consecutive health checks of a single target
    timeout  = 100   # amount of time to consider a health check as a failure
    matcher  = "200" # success code, here a range can also be specified e.g. 200-299
  }

  stickiness {
    type        = "app_cookie"
    cookie_name = "session" # name of the cookie session in our backend
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-tg" })
  )
}
