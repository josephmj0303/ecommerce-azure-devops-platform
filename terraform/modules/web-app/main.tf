resource "azurerm_linux_web_app" "app" {
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id     = var.service_plan_id

  site_config {
    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    NODE_ENV  = "production"
    DB_HOST   = var.db_host
    DB_PORT   = "5432"
    DB_NAME   = var.db_name
    DB_USER   = var.db_user
    DB_PASSWORD = var.db_password
    SCM_DO_BUILD_DURING_DEPLOYMENT = "true"
  }
}
