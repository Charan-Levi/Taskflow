
variable "name_prefix" {
  type        = string
  description = "Provide perfix Name for resources"
  default     = "taskflow-dev"
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

variable "vnet_id" {
  type = string
  description = "Virtual Network ID"
}

variable "pg_version" {
  type = string
  description = "Postgre SQL Version"
}

variable "database_subnet_id" {
  type = string
  description = "Database subnet resource id"
}

variable "postgres_admin" {
  type = string
  description = "Postgres Admin Username"
}

variable "postgres_pass" {
  type = string
  description = "Postgres Admin Password"
  sensitive = true
}

variable "database_name" {
  type = string
  description = "name of the database to create in Postgres"
}

variable "sku_name" {
  type    = string
  default = "B_Standard_B2s"  # dev default
}