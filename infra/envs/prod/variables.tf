variable "postgres_pass" {
  type        = string
  description = "Postgres Admin Password for Prod database"
  sensitive   = true
}