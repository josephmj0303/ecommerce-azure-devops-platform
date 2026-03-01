resource "azurerm_postgresql_flexible_server" "pg" {
  name                   = var.name
  resource_group_name    = var.resource_group_name
  location               = var.location
  administrator_login    = var.admin_user
  administrator_password = var.admin_password
  version                = "17"
  sku_name               = "B_Standard_B1ms"
  storage_mb             = 32768

  public_network_access_enabled = true

}
