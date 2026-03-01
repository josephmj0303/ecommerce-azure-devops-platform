variable "name" {}
variable "resource_group_name" {}
variable "location" {}

variable "admin_user" {}
variable "admin_password" {
  sensitive = true
}

variable "postgres_version" {
  default = "16"
}

variable "sku_name" {
  default = "B_Standard_B1ms"
}

variable "storage_mb" {
  default = 32768
}

variable "public_network_access_enabled" {
  default = true
}
