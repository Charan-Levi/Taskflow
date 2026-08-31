terraform {
  backend "azurerm" {
    resource_group_name  = "rg-bootstrap"
    storage_account_name = "storageacc707"
    container_name       = "tfstate"
    key                  = "envs/dev/terraform.tfstate"
  }
}
