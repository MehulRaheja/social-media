resource "aws_autoscaling_policy" "asg_scale_out_policy" {
  name = "ASG-SCALE-OUT-POLICY"
  autoscaling_group_name = aws_autoscaling_group.ec2_autoscaling_group.name
  adjustment_type = "ChangeInCapacity"
  policy_type = "SimpleScaling"
  scaling_adjustment = 1 # no. of instances added at a time
  cooldown = 150 # time in seconds after it will terminate the instance if traffic has decreased
  depends_on = [
    aws_autoscaling_group.ec2_autoscaling_group
  ]
}

# cloud watch alarm if no. of instances changed
# if server reaches to certain threshold than this alarm will trigger the above auto-scaling policy, to add new instances
resource "aws_cloudwatch_metric_alarm" "ec2_scale_out_alarm" {
  alarm_name = "EC2-SCALE-OUT-ALARM"
  alarm_description = "This metric monitors EC2 CPU utilization"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods = "1" # in minutes
  metric_name = "CPUUtilization"
  namespace = "AWS/EC2"
  period = "120" # in seconds
  statistic = "Average"
  threshold = 50 # when cpu utilization will greator than or equal to 50% on an average of all the instances than this alarm will trigger the above policy
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.ec2_autoscaling_group.name
  }
  alarm_actions = [aws_autoscaling_policy.asg_scale_out_policy.arn] # policies triggered with this alarm
  depends_on = [
    aws_autoscaling_group.ec2_autoscaling_group
  ]
}

resource "aws_autoscaling_policy" "asg_scale_in_policy" {
  name = "ASG-SCALE-IN-POLICY"
  autoscaling_group_name = aws_autoscaling_group.ec2_autoscaling_group.name
  adjustment_type = "ChangeInCapacity"
  policy_type = "SimpleScaling"
  scaling_adjustment = -1 # no. of instances terminated at a time
  cooldown = 150 # time in seconds after it will terminate the instance if traffic has decreased
  depends_on = [
    aws_autoscaling_group.ec2_autoscaling_group
  ]
}

# cloud watch alarm if no. of instances changed
# if server reaches to certain threshold than this alarm will trigger the above auto-scaling policy, to add new instances
resource "aws_cloudwatch_metric_alarm" "ec2_scale_in_alarm" {
  alarm_name = "EC2-SCALE-IN-ALARM"
  alarm_description = "This metric monitors EC2 CPU utilization"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods = "1" # in minutes
  metric_name = "CPUUtilization"
  namespace = "AWS/EC2"
  period = "120" # in seconds
  statistic = "Average"
  threshold = 10 # when cpu utilization will greator than or equal to 50% on an average of all the instances than this alarm will trigger the above policy
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.ec2_autoscaling_group.name
  }
  alarm_actions = [aws_autoscaling_policy.asg_scale_in_policy.arn] # policies triggered with this alarm
  depends_on = [
    aws_autoscaling_group.ec2_autoscaling_group
  ]
}

# these policies are going to set conditions for terminating and initiating instances
