# DevOps 

## Commands

### Initialize the repo 
terraform init -no-color

### Plan the infrastructure 
terraform plan -no-color --var-file="variables.tfvars" 

### Apply the plan with auto approve 
terraform apply -no-color --var-file="variables.tfvars" -auto-approve 

### Destroy the infra with auto approve 
terraform destroy -no-color --var-file="variables.tfvars" -auto-approve 
