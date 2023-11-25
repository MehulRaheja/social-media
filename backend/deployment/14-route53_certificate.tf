# step 1: create the certificate
# step 2: add it to hosted zone record
# step 3: validate the certificate
resource "aws_acm_certificate" "dev_cert" {
  domain_name = var.dev_api_server_domain
  validation_method = "DNS"

  # another way to add tag
  tags = {
    "Name" = local.prefix
    Environment = terraform.workspace
  }

  lifecycle {
    create_before_destroy = true # if we want to update the resource and it can not be updated while working then it will destroy the resource and create a new one
  }
}

resource "aws_route53_record" "cert_validation_record" {
  allow_overwrite = false
  ttl = 60 # 60 seconds
  zone_id = data.aws_route53_zone.main.zone_id # zone id is created automatically, so we can it this way
  name = tolist(aws_acm_certificate.dev_cert.domain_validation_options)[0].resource_record_name # tolist() is function which we use to convert an object into a list
  records = [tolist(aws_acm_certificate.dev_cert.domain_validation_options)[0].resource_record_value]
  type = tolist(aws_acm_certificate.dev_cert.domain_validation_options)[0].resource_record_type
}

# for certificate validation
# arn: amazon resource name, fqdn: fully qualified domain name
resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn = aws_acm_certificate.dev_cert.arn
  validation_record_fqdns = [aws_route53_record.cert_validation_record.fqdn]
}
