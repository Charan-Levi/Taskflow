data "azurerm_client_config" "current" {}
resource "azurerm_container_registry" "acr" {
  name                = "${replace(var.name_prefix, "-", "")}acr"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = var.acr_sku
  tags                = var.tags
  admin_enabled       = false
}

resource "azurerm_role_assignment" "acrpull" {
  name = "AcrPull"
  scope = azurerm_container_registry.acr.id
  principal_id = data.azurerm_client_config.current.object_id
}