resource "azurerm_private_dns_zone" "private-dns" {
  name                = "${var.name_prefix}.postgres.database.azure.com"
  resource_group_name = var.resource_group_name
  tags                = var.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "dns-vnet-link" {
  name                  = "${var.name_prefix}VNetZone.com"
  private_dns_zone_name = azurerm_private_dns_zone.private-dns.name
  resource_group_name   = var.resource_group_name
  virtual_network_id    = var.vnet_id
}

resource "azurerm_postgresql_flexible_server" "pg" {
  name                          = "${var.name_prefix}-taskflowpsqlserver"
  resource_group_name           = var.resource_group_name
  location                      = var.location
  version                       = var.pg_version
  delegated_subnet_id           = var.database_subnet_id
  private_dns_zone_id           = azurerm_private_dns_zone.private-dns.id
  public_network_access_enabled = false
  administrator_login           = var.postgres_admin
  administrator_password        = var.postgres_pass
  zone                          = "1"
  tags                          = var.tags
  sku_name                      = var.sku_name
  storage_mb                    = 32768
  backup_retention_days         = 30
  lifecycle {
    ignore_changes = [zone]
  }
}

resource "azurerm_postgresql_flexible_server_database" "pg-db" {
  name      = var.database_name
  server_id = azurerm_postgresql_flexible_server.pg.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}