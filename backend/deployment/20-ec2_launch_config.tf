# this is the ec2 launch configuration
# for this key-pair was manually created on aws

resource "aws_launch_configuration" "asg_launch_configuration" {
  name = "${local.prefix}-launch-config"
  image_id = data.aws_ami.ec2_ami.id
  instance_type = var.ec2_instance_type
  key_name = "socialiserKeyPair" # key-pair with this name was created on aws, in ppk format which is supported on the windows, for mac and linux choose the other one
  associate_public_ip_address = false # we don't want any public ip on instances launch on our private subnet
  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name
  security_groups = [aws_security_group.autoscaling_group_sg.id]
  user_data = filebase64("${path.module}/userdata/user-data.sh") # path.module is made available by terraform

  lifecycle {
    create_before_destroy = true
  }
}
