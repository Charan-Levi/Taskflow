locals {
  name_prefix = "taskflow-prod"
  tags = {
    "Environment" = "Prod"
    "Project"     = "Taskflow"
    "ManagedBy"   = "Terraform"
    "Owner"       = "Charan-Levi"
  }
}

module "rg" {
  source      = "../../modules/resource-group"
  name_prefix = local.name_prefix
  location    = "centralindia"
  tags        = local.tags
}

module "networking" {
  source                  = "../../modules/networking"
  name_prefix             = local.name_prefix
  resource_group_name     = module.rg.resource_group_name
  location               = module.rg.location
  address_space          = "10.20.0.0/16"
  public_address_prefix  = "10.20.1.0/24"
  aks_address_prefix      = "10.20.2.0/24"
  database_address_prefix = "10.20.3.0/24"
  tags                   = local.tags
}

module "postgres" {
  source              = "../../modules/postgres"
  resource_group_name = module.rg.resource_group_name
  location            = module.rg.location
  database_subnet_id = module.networking.database_subnet_id
  vnet_id            = module.networking.vnet_id
  pg_version         = 16
  postgres_admin      = "taskmanager"
  postgres_pass      = var.postgres_pass
  database_name      = "taskmanager"
  sku_name           = "B_Standard_B2s"  # Upgrade for prod if needed
}

module "acr" {
  source              = "../../modules/acr"
  name_prefix        = local.name_prefix
  resource_group_name = module.rg.resource_group_name
  location           = module.rg.location
  acr_sku           = "Premium"  # Premium for geo-replication
}

module "aks" {
  source              = "../../modules/aks"
  name_prefix        = local.name_prefix
  resource_group_name = module.rg.resource_group_name
  location           = module.rg.location
  tags               = local.tags
  node_vmsize       = "Standard_D4ds_v5"  # Or larger for prod
  vnet_subnet_id    = module.networking.aks_subnet_id
  acr_id            = module.acr.acr_id
}

module "keyvault" {
  source              = "../../modules/keyvault"
  name_prefix        = local.name_prefix
  resource_group_name = module.rg.resource_group_name
  location           = module.rg.location
  tags               = local.tags
  postgres_pass      = var.postgres_pass
}

module "identity" {
  source              = "../../modules/identity"
  environment         = "prod"
  resource_group_name = module.rg.resource_group_name
  location           = module.rg.location
  keyvault_id        = module.keyvault.vault_id
  aks_oidc_issuer_url = module.aks.oidc_issuer_url
  fic_subject = "system:serviceaccount:external-secrets:external-secrets"
  tags               = local.tags
}