#!/bin/bash
# =============================================================================
# deploy-railway.sh — Script de despliegue automatizado en Railway
# =============================================================================
# Uso:
#   chmod +x scripts/deploy-railway.sh
#   ./scripts/deploy-railway.sh
#
# Requisitos:
#   - Railway CLI instalado: npm install -g @railway/cli
#   - Logueado en Railway: railway login
#   - Proyecto vinculado: railway link
# =============================================================================

set -e

echo "🚀 Iniciando despliegue de Clínica X en Railway..."

# Verificar que railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Error: Railway CLI no está instalado."
    echo "   Instálalo con: npm install -g @railway/cli"
    exit 1
fi

# Verificar que estamos logueados
if ! railway whoami &> /dev/null; then
    echo "❌ Error: No estás logueado en Railway."
    echo "   Ejecuta: railway login"
    exit 1
fi

# Verificar que el proyecto está vinculado
if ! railway status &> /dev/null; then
    echo "❌ Error: No hay proyecto vinculado."
    echo "   Ejecuta: railway link"
    exit 1
fi

echo ""
echo "📋 Servicios a desplegar:"
echo "   1. auth-service"
echo "   2. appointment-service"
echo "   3. clinical-service"
echo "   4. file-service"
echo "   5. ocr-service"
echo "   6. api-gateway"
echo "   7. frontend"
echo ""

# Desplegar cada servicio
SERVICES=(
    "services/auth-service:auth-service"
    "services/appointment-service:appointment-service"
    "services/clinical-service:clinical-service"
    "services/file-service:file-service"
    "services/ocr-service:ocr-service"
    "services/api-gateway:api-gateway"
    "frontend:frontend"
)

for service_mapping in "${SERVICES[@]}"; do
    IFS=':' read -r dir name <<< "$service_mapping"
    
    echo "🔹 Desplegando $name desde $dir..."
    railway up --service "$name" --directory "$dir"
    
    if [ $? -eq 0 ]; then
        echo "   ✅ $name desplegado exitosamente"
    else
        echo "   ❌ Error desplegando $name"
        exit 1
    fi
    echo ""
done

echo ""
echo "🎉 ¡Todos los servicios han sido desplegados en Railway!"
echo ""
echo "📌 Próximos pasos:"
echo "   1. Configura las variables de entorno en el dashboard de Railway"
echo "   2. Verifica que los healthchecks respondan correctamente"
echo "   3. Configura el dominio personalizado si es necesario"
echo "   4. Ejecuta las migraciones de Prisma:"
echo "      railway run --service auth-service pnpm prisma migrate deploy"
echo "      railway run --service appointment-service pnpm prisma migrate deploy"
echo "      railway run --service clinical-service pnpm prisma migrate deploy"
echo "      railway run --service file-service pnpm prisma migrate deploy"
echo ""
