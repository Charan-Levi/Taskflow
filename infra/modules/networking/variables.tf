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

variable "address_space" {
  type    = string
  default = "10.10.0.0/16"
}

variable "public_address_prefix" {
  type    = string
  default = "10.10.1.0/24"
}

variable "aks_address_prefix" {
  type    = string
  default = "10.10.2.0/24"
}

variable "database_address_prefix" {
  type    = string
  default = "10.10.3.0/24"
}
