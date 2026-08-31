output "server_fqdn" {
  value = azurerm_postgresql_flexible_server.pg.fqdn
}

output "database_name" {
  value = azurerm_postgresql_flexible_server_database.pg-db.name
}

output "administrator_login" {
  value = azurerm_postgresql_flexible_server.pg.administrator_login
}

output "connection_string" {
  value     = "postgresql://${azurerm_postgresql_flexible_server.pg.administrator_login}:${azurerm_postgresql_flexible_server.pg.administrator_password}@${azurerm_postgresql_flexible_server.pg.fqdn}:5432/${azurerm_postgresql_flexible_server_database.pg-db.name}"
  sensitive = true
}