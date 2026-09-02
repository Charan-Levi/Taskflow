output "eso-client_id" {
  value = azurerm_user_assigned_identity.eso.client_id
}

output "eso-object-id" {
  value = azurerm_user_assigned_identity.eso.principal_id
}