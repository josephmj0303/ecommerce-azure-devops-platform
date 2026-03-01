
resource "azurerm_postgresql_flexible_server" "pg" {
  name                   = var.name
  resource_group_name    = var.resource_group_name
  location               = var.location
  administrator_login    = var.admin_user
  administrator_password = var.admin_password

  version                = var.postgres_version
  sku_name               = var.sku_name
  storage_mb             = var.storage_mb

  public_network_access_enabled = var.public_network_access_enabled
}
