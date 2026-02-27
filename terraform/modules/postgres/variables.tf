variable "name" {}
variable "location" {}
variable "resource_group_name" {}
variable "admin_user" {}
variable "admin_password" {
  sensitive = true
}
