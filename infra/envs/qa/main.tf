locals {
  name_prefix = "taskflow-qa"
  tags = {
    "Environment" = "QA"
    "Project"     = "Taskflow"
    "ManagedBy"   = "Terraform"
    "Owner"       = "Charan-Levi"
  }
  dev_resource_group   = "rg-taskflow-dev"
  qa_resource_group    = "rg-taskflow-qa"
}

data "azurerm_postgresql_flexible_server" "dev_pg" {
  name                = "taskflow-dev-taskflowpsqlserver"
  resource_group_name = local.dev_resource_group
}

data "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-taskflow-dev"
  resource_group_name = local.dev_resource_group
}

module "rg" {
  source      = "../../modules/resource-group"
  name_prefix = local.name_prefix
  location    = "centralindia"
  tags        = local.tags
}

module "keyvault" {
  source              = "../../modules/keyvault"
  name_prefix         = local.name_prefix
  resource_group_name = module.rg.resource_group_name
  location            = "centralindia"
  tags                = local.tags
  postgres_pass       = var.postgres_pass
}

module "identity" {
  source              = "../../modules/identity"
  environment         = "qa"
  resource_group_name = module.rg.resource_group_name
  location            = "centralindia"
  keyvault_id         = module.keyvault.vault_id
  aks_oidc_issuer_url = data.azurerm_kubernetes_cluster.aks.oidc_issuer_url
  tags                = local.tags
}

resource "azurerm_postgresql_flexible_server_database" "qa_db" {
  name      = "taskmanager_qa"
  server_id = data.azurerm_postgresql_flexible_server.dev_pg.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

resource "azurerm_role_assignment" "qa_identity_keyvault" {
  role_definition_name = "Key Vault Secrets User"
  principal_id         = module.identity.eso-object-id
  scope                = module.keyvault.vault_id
}
