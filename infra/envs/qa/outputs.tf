output "keyvault_name" {
  value = module.keyvault.vault_name
}

output "keyvault_uri" {
  value = module.keyvault.vault_uri
}

output "keyvault_id" {
  value = module.keyvault.vault_id
}

output "eso_client_id" {
  value = module.identity.eso-client_id
}

output "eso_object_id" {
  value = module.identity.eso-object-id
}

output "pg_server_fqdn" {
  value = data.azurerm_postgresql_flexible_server.dev_pg.fqdn
}

output "pg_database_name" {
  value = azurerm_postgresql_flexible_server_database.qa_db.name
}

output "pg_connection_string" {
  value     = "postgresql://taskmanager:${var.postgres_pass}@${data.azurerm_postgresql_flexible_server.dev_pg.fqdn}:5432/taskmanager_qa"
  sensitive = true
}
