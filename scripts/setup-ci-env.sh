#!/bin/bash
# Script para configurar las variables de entorno (.env) de todos los servicios para CI/CD

echo "Configurando variables de entorno para CI/CD..."

# 1. Root .env
cat <<EOF > .env
HOST_BIND_IP=127.0.0.1
HOST_AUTH_PORT=3000
HOST_APPOINTMENT_PORT=3001
HOST_CLINICAL_PORT=3002
HOST_FILE_PORT=3003
HOST_GATEWAY_PORT=8080
JWT_SECRET=change_this_secret_to_something_very_long_123456
JWT_EXPIRES_IN=1d
EOF

# 2. auth-service .env
cat <<EOF > services/auth-service/.env
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=auth_service"
DIRECT_URL="postgresql://postgres:password@localhost:5432/postgres?schema=auth_service"
JWT_SECRET=change_this_secret_to_something_very_long_123456
JWT_EXPIRES_IN=1d
SUPABASE_EDGE_FUNCTION_URL=http://localhost:54321/functions/v1
SUPABASE_SERVICE_ROLE_KEY=dummy_supabase_service_role_key_value_123456
INTERNAL_EMAIL_SECRET=change-this-email-secret-key-123456
FRONTEND_URL=http://localhost:3100
EOF

# 3. appointment-service .env
cat <<EOF > services/appointment-service/.env
PORT=3001
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=appointment_service"
DIRECT_URL="postgresql://postgres:password@localhost:5432/postgres?schema=appointment_service"
JWT_SECRET=change_this_secret_to_something_very_long_123456
AUTH_SERVICE_URL=http://localhost:3000
EOF

# 4. clinical-service .env
cat <<EOF > services/clinical-service/.env
PORT=3002
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=clinical_service"
DIRECT_URL="postgresql://postgres:password@localhost:5432/postgres?schema=clinical_service"
JWT_SECRET=change_this_secret_to_something_very_long_123456
AI_ENABLED=false
OPENAI_API_KEY=dummy_openai_key
AI_TIMEOUT_MS=20000
AUTH_SERVICE_URL=http://localhost:3000
APPOINTMENT_SERVICE_URL=http://localhost:3001
FILE_SERVICE_URL=http://localhost:3003
EOF

# 5. file-service .env
cat <<EOF > services/file-service/.env
PORT=3003
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=file_service"
DIRECT_URL="postgresql://postgres:password@localhost:5432/postgres?schema=file_service"
JWT_SECRET=change_this_secret_to_something_very_long_123456
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=dummy_supabase_service_role_key_value_123456
SUPABASE_BUCKET=clinica-x-archivos
AWS_REGION=us-east-1
AWS_BUCKET=clinica-x-archivos
AWS_ACCESS_KEY_ID=dummy_aws_key
AWS_SECRET_ACCESS_KEY=dummy_aws_secret
MAX_FILE_SIZE_BYTES=10485760
ALLOWED_MIME_TYPES=application/pdf,image/jpeg,image/png
EOF

# 6. ocr-service .env
cat <<EOF > services/ocr-service/.env
PORT=3004
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=clinical_service"
DIRECT_URL="postgresql://postgres:password@localhost:5432/postgres?schema=clinical_service"
JWT_SECRET=change_this_secret_to_something_very_long_123456
OCR_SPACE_API_KEY=dummy_ocr_space_key
OCR_SPACE_API_URL=https://api.ocr.space/parse/image
OCR_SPACE_ENGINE=2
OCR_SPACE_LANGUAGE=spa
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=dummy_supabase_service_role_key_value_123456
SUPABASE_BUCKET=clinica-x-archivos
FILE_SERVICE_URL=http://localhost:3003
AUTH_SERVICE_URL=http://localhost:3000
NODE_ENV=development
EOF

# 7. api-gateway .env
cat <<EOF > services/api-gateway/.env
PORT=8080
AUTH_SERVICE_URL=http://localhost:3000
APPOINTMENT_SERVICE_URL=http://localhost:3001
CLINICAL_SERVICE_URL=http://localhost:3002
FILE_SERVICE_URL=http://localhost:3003
OCR_SERVICE_URL=http://localhost:3004
AI_SERVICE_URL=http://localhost:3005
JWT_SECRET=change_this_secret_to_something_very_long_123456
CORS_ORIGIN=http://localhost:3100
EOF

# 8. test-usabilidad .env
cat <<EOF > test-usabilidad/.env
FRONTEND_URL=https://clinica-x.up.railway.app
API_URL=https://clinica-x.up.railway.app/api
PAGESPEED_API_KEY=\${PAGESPEED_API_KEY:-}
EOF

echo "Variables de entorno configuradas exitosamente."
