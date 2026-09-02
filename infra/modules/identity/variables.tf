variable "environment" {
  type        = string
  description = "Provide environment Name for eso UAMI"
  default     = "dev"
}

variable "resource_group_name" {
  type        = string
  description = "Provide Name for a resource group"
  default     = "rg-default"
}

variable "location" {
  type        = string
  description = "Name to location to deploy resources into"
  default     = "centralindia"
}

variable "tags" {
  type        = map(string)
  description = "Tags to sepearate resources"
  default = {
    "Env"       = "Dev"
    "ManagedBy" = "Terraform"
  }
}

variable "aks_oidc_issuer_url" {
  type = string
}

variable "keyvault_id" {
  type = string
}