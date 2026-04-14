module "rg" {
  source   = "../../modules/resource-group"
  name     = var.resource_group_name
  location = var.location
}

module "plan" {
  source              = "../../modules/service-plan"
  name                = var.app_service_plan_name
  location            = var.location
  resource_group_name = module.rg.name
}

module "backend_api" {
  source              = "../../modules/web-app"
  name                = var.backend_api_name
  location            = var.location
  resource_group_name = module.rg.name
  service_plan_id     = module.plan.id

  db_host     = "${var.postgres_name}.postgres.database.azure.com"
  db_name     = "EbookTest"
  db_user     = var.postgres_admin_user
  db_password = var.postgres_admin_password
}

module "backend_admin" {
  source              = "../../modules/web-app"
  name                = var.backend_admin_name
  location            = var.location
  resource_group_name = module.rg.name
  service_plan_id     = module.plan.id

  db_host     = "${var.postgres_name}.postgres.database.azure.com"
  db_name     = "EbookTest"
  db_user     = var.postgres_admin_user
  db_password = var.postgres_admin_password
}

module "frontend_client" {
  source              = "../../modules/static-web-app"
  name                = var.frontend_client_name
  location            = var.location
  resource_group_name = module.rg.name
}

module "frontend_admin" {
  source              = "../../modules/static-web-app"
  name                = var.frontend_admin_name
  location            = var.location
  resource_group_name = module.rg.name
}

module "postgres" {
  source              = "../../modules/postgres"
  name                = var.postgres_name
  location            = var.location
  resource_group_name = module.rg.name

  admin_user          = var.postgres_admin_user
  admin_password      = var.postgres_admin_password
  zone 		      = var.zone
}
