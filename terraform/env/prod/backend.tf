terraform {
  backend "azurerm" {
    resource_group_name  = "rg-joedevopslab-network"
    storage_account_name = "joedevopstfstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}

