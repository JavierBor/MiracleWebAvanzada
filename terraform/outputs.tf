output "staging_config" {
  description = "Resumen de la configuracion proyectada para el ambiente de staging"
  value       = terraform_data.staging_environment.output
}