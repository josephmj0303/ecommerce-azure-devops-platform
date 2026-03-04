# Deployment Guide

This guide explains how to deploy the `ecommerce-azure-devops-platform` repository to Azure using the existing Terraform and GitHub Actions setup in this repo.

## 1) What this repository deploys

Based on the Terraform and workflow configuration, deployment targets are:

- Azure Resource Group
- Azure App Service Plan (Linux)
- Azure Web App for `backend-api`
- Azure Web App for `backend-admin`
- Azure Static Web App for `frontend-client`
- Azure Static Web App for `frontend-admin`
- Azure PostgreSQL Flexible Server (configured in `dev`)

> Note: The `prod` Terraform root currently creates web and static apps, but does not instantiate the PostgreSQL module.

---

## 2) Prerequisites

Install and configure the following locally:

- Azure CLI (`az`) and login access to your target subscription
- Terraform `>= 1.5.0`
- GitHub repository admin access (for Actions secrets/environments)
- Node.js 20.x (for local backend verification)

Authenticate to Azure:

```bash
az login
az account set --subscription "<SUBSCRIPTION_NAME_OR_ID>"
```

---

## 3) Configure Terraform remote state

Terraform state is configured to use an Azure Storage backend.
Create these once (or adjust `backend.tf` values to match your environment):

- Resource Group: `rg-terraform-state`
- Storage Account: `joedevopstfstate`
- Blob Container: `tfstate`

Initialize this state location before first apply.

---

## 4) Create GitHub secrets (required for CI/CD)

In your GitHub repo, set these secrets used by workflows:

- `AZURE_CREDENTIALS`
  - Service principal JSON used by `azure/login@v1`
- `POSTGRES_ADMIN_PASSWORD`
  - Used as `TF_VAR_postgres_admin_password` in Terraform workflow
- `SWA_CLIENT_TOKEN`
  - Used by `frontend-client.yml`
- `SWA_ADMIN_TOKEN`
  - Recommended for `frontend-admin` deployment (see fix note below)

### Service principal example

Create a service principal with Contributor access to your subscription:

```bash
az ad sp create-for-rbac \
  --name "gh-ecommerce-deploy" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID> \
  --sdk-auth
```

Copy the JSON output into GitHub secret `AZURE_CREDENTIALS`.

---

## 5) Configure GitHub environments and branch strategy

The Terraform workflow behavior is branch based:

- Push to `dev` → runs `terraform/env/dev`
- Push to `main` → runs `terraform/env/prod`

Also, `terraform-prod` is tied to GitHub environment `production` (approval gate).

Recommended:

1. Create `production` environment in GitHub.
2. Add required reviewers for manual approval.
3. Protect `main` branch.

---

## 6) Validate Terraform locally before first pipeline run

From repo root:

```bash
cd terraform/env/dev
terraform init
terraform validate
terraform plan -var="postgres_admin_password=<REDACTED>"
```

Repeat for prod:

```bash
cd ../prod
terraform init
terraform validate
terraform plan -var="postgres_admin_password=<REDACTED>"
```

If your backend state resources are in place and Azure auth is active, this catches most IaC issues before CI.

---

## 7) Deploy infrastructure

### Dev deployment

Push infra changes to `dev`:

```bash
git checkout dev
git add terraform/
git commit -m "infra: update dev"
git push origin dev
```

This triggers `.github/workflows/terraform.yml` (`terraform-dev` job).

### Production deployment

Push/merge infra changes to `main`:

```bash
git checkout main
git add terraform/
git commit -m "infra: update prod"
git push origin main
```

This triggers `.github/workflows/terraform.yml` (`terraform-prod` job) and waits for `production` environment approval.

---

## 8) Deploy application components

Each component deploys automatically when files in its path change:

- `backend-api/**` → `.github/workflows/backend-api.yml`
- `backend-admin/**` → `.github/workflows/backend-admin.yml`
- `frontend-client/**` → `.github/workflows/frontend-client.yml`
- `frontend-admin/**` → `.github/workflows/frontend-admin.yml`

Typical flow:

```bash
git checkout main
git add backend-api/ backend-admin/ frontend-client/ frontend-admin/
git commit -m "app: deploy updates"
git push origin main
```

---

## 9) Post-deployment validation checklist

1. **Terraform jobs succeeded** in GitHub Actions.
2. **Backend health checks**:
   - `https://<backend-api-app>.azurewebsites.net/health`
   - `https://<backend-admin-app>.azurewebsites.net/health`
3. **Frontends accessible** from Azure Static Web App URLs.
4. **Database connectivity** confirmed in backend logs.
5. **CORS/APP settings** are correct in App Service configuration.

---

## 10) Important repository observations (fix before production hardening)

1. **`terraform/env/prod/main.tf` uses `module.plan.plan_id`**
   - Current output in `modules/service-plan/outputs.tf` is `id`, not `plan_id`.
   - Recommended fix: replace `module.plan.plan_id` with `module.plan.id`.

2. **`terraform/env/prod/main.tf` does not instantiate the PostgreSQL module**
   - If production database should be managed by Terraform, add `module "postgres"` as in `dev`.

3. **`frontend-admin` workflow currently references `SWA_CLIENT_TOKEN`**
   - Better practice is separate secrets per app.
   - Recommended fix in `.github/workflows/frontend-admin.yml`:
     - `azure_static_web_apps_api_token: ${{ secrets.SWA_ADMIN_TOKEN }}`

4. **Frontend deploy action uses `output_location: "dist"` while repo appears to store built artifacts directly**
   - Verify your intended deployment mode (source build vs prebuilt artifact).
   - If this repo stores final built output at root of each frontend folder, set `output_location` appropriately (often empty string).

---

## 11) Rollback strategy

- **Infrastructure rollback**: use `terraform plan` against previous commit and apply.
- **Application rollback**: revert Git commit and push; workflows redeploy previous state.
- **DB rollback**: restore from PostgreSQL backup (`pg_dump`/`pg_restore`) following your backup policy.

---

## 12) Quick command reference

```bash
# Terraform dev
cd terraform/env/dev && terraform init && terraform apply -auto-approve

# Terraform prod
cd terraform/env/prod && terraform init && terraform apply -auto-approve

# Backend local smoke test
cd backend-api && npm ci && npm start
cd backend-admin && npm ci && npm start
```

