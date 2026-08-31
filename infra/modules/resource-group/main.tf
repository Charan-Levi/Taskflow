resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.name_prefix}"
  location = var.location
  tags     = var.tags
}
