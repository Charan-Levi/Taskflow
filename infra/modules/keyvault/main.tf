data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "kv" {
  name                       = "kv${var.name_prefix}"
  resource_group_name        = var.resource_group_name
  location                   = var.location
  sku_name                   = "standard"
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  rbac_authorization_enabled = true
  soft_delete_retention_days = 7
  purge_protection_enabled   = false
  tags                       = var.tags
}

resource "azurerm_role_assignment" "kv_owner" {
  scope                = azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azurerm_client_config.current.object_id
}
resource "time_sleep" "wait_for_rbac" {
  depends_on      = [azurerm_role_assignment.kv_owner]
  create_duration = "60s"
}
resource "azurerm_key_vault_secret" "kvsecret" {
  key_vault_id = azurerm_key_vault.kv.id
  name         = "postgres-password"
  value        = var.postgres_pass
  depends_on   = [time_sleep.wait_for_rbac]
}