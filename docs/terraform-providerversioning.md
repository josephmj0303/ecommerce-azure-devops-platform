# Terraform Provider Version Compatibility (AzureRM)

## Overview
This document explains an issue encountered during Terraform deployment due to AzureRM provider version incompatibility.

## Problem
Terraform deployments failed due to breaking changes introduced in newer AzureRM provider versions.

## Root Cause
- Provider version was not pinned earlier
- New releases introduced incompatible changes
- Deprecated arguments caused validation failures

## Fix
- Added version constraint in `providers.tf`:

```hcl
azurerm = {
  source  = "hashicorp/azurerm"
  version = "~> 3.0"
}
