variable "name" {}
variable "location" {}
variable "resource_group_name" {}
variable "service_plan_id" {}

variable "db_host" {}
variable "db_name" {}
variable "db_user" {}
variable "db_password" {
  sensitive = true
}
