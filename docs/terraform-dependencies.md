# Terraform Dependency Handling

## Problem
Terraform apply failed due to resource creation order issues.

## Fix
Used explicit `depends_on` to enforce resource creation order.

## Example
```hcl
depends_on = [azurerm_virtual_network.vnet]
