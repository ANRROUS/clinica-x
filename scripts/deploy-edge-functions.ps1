# =============================================================================
# deploy-edge-functions.ps1
# Despliega las Edge Functions de Supabase
# =============================================================================
# Uso: .\scripts\deploy-edge-functions.ps1
# Requiere: SUPABASE_ACCESS_TOKEN en variable de entorno
# =============================================================================

param(
  [string]$AccessToken = "",
  [string]$ProjectRef = "jwcfqgvfvkszsqeejewz"
)

if (-not $AccessToken) {
  $AccessToken = $env:SUPABASE_ACCESS_TOKEN
}

if (-not $AccessToken) {
  Write-Error "SUPABASE_ACCESS_TOKEN no está configurado. Pásalo como parámetro o define la variable de entorno."
  exit 1
}

$env:SUPABASE_ACCESS_TOKEN = $AccessToken

# ─── Vincular proyecto ───────────────────────────────────────────────────────
Write-Host "🔗 Vinculando proyecto $ProjectRef ..." -ForegroundColor Cyan
supabase link --project-ref $ProjectRef
if (-not $?) { exit 1 }

# ─── Desplegar funciones ─────────────────────────────────────────────────────
Write-Host "🚀 Desplegando send-reset-email ..." -ForegroundColor Cyan
supabase functions deploy send-reset-email
if (-not $?) { exit 1 }

# ─── Mostrar resultado ───────────────────────────────────────────────────────
Write-Host "✔ Despliegue completado" -ForegroundColor Green
Write-Host "  Función: send-reset-email"
Write-Host "  URL: https://$ProjectRef.supabase.co/functions/v1/send-reset-email"
