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
}

module "backend_admin" {
  source              = "../../modules/web-app"
  name                = var.backend_admin_name
  location            = var.location
  resource_group_name = module.rg.name
  service_plan_id     = module.plan.id
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
