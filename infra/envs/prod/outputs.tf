output "resource_group_name" {
  value = module.rg.resource_group_name
}

output "location" {
  value = module.rg.location
}

output "pg_server_fqdn" {
  value = module.postgres.server_fqdn
}

output "pg_admin" {
  value = module.postgres.administrator_login
}

output "pg_database" {
  value = module.postgres.database_name
}

output "acr_login_server" {
  value = module.acr.acr_login_server
}

output "aks_cluster_name" {
  value = module.aks.cluster_name
}

output "aks_cluster_id" {
  value = module.aks.cluster_id
}

output "aks_oidc_issuer_url" {
  value = module.aks.oidc_issuer_url
}

output "kv_vault_name" {
  value = module.keyvault.vault_name
}

output "kv_vault_uri" {
  value = module.keyvault.vault_uri
}

output "kv_vault_id" {
  value = module.keyvault.vault_id
}

output "eso_client_id" {
  value = module.identity.eso_client_id
}