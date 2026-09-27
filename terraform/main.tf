terraform {
  required_version = ">= 1.5.0"
}

resource "terraform_data" "staging_environment" {
  input = {
    project     = var.project_name
    environment = var.environment
    services    = ["frontend-angular", "backend-nestjs", "microservice-fastapi", "postgres-db"]
  }
}