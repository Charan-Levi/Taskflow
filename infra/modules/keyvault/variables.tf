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

variable "postgres_pass" {
  type      = string
  sensitive = true
}