variable "location" {
  default = "West US 2"
}

variable "environment" {
  default = "dev"
}

variable "resource_group_name" {}
variable "app_service_plan_name" {}

variable "backend_api_name" {}
variable "backend_admin_name" {}

variable "frontend_client_name" {}
variable "frontend_admin_name" {}

variable "postgres_name" {}
variable "postgres_admin_user" {}
variable "postgres_admin_password" {
  sensitive = true
}
variable "zone" {
  description = "Availability zone for PostgreSQL"
  type        = string
  default     = "2"
}
