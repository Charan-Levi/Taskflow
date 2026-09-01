terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.3"
    }
  }
  required_version = "1.15.8"
}

provider "azurerm" {
  features {

  }
}
