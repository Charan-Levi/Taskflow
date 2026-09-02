resource "azurerm_user_assigned_identity" "eso" {
  name = "id-eso-${var.environment}"
  resource_group_name = var.resource_group_name
  location = var.location
  tags = var.tags
}

resource "azurerm_federated_identity_credential" "eso-fic" {
  name = "fic-eso-${var.environment}"
  user_assigned_identity_id = azurerm_user_assigned_identity.eso.id
  issuer = var.aks_oidc_issuer_url
  subject = "system:serviceaccount:external-secrets:external-secrets"
  audience = ["api://AzureADTokenExchange"]
}

resource "azurerm_role_assignment" "eso_keyvault" {
  role_definition_name = "Key Vault Secrets User"
  principal_id = azurerm_user_assigned_identity.eso.principal_id
  scope = var.keyvault_id
}