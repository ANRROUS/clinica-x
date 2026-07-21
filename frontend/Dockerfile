# =============================================================================
# frontend — Dockerfile multi-stage
# =============================================================================
# Stage 1 (builder): instala dependencias y compila Next.js
# Stage 2 (runtime): solo runtime + artifacts compilados
# =============================================================================

# --- Stage 1: builder ---
FROM node:20-alpine AS builder
WORKDIR /workspace

# Inyectar variables en build time para Next.js
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Habilitar pnpm vía corepack
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copiar manifests del monorepo
COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages ./packages
COPY frontend ./frontend

# Instalar dependencias del workspace (filtrando, versiones bloqueadas, sin lifecycle scripts)
RUN pnpm install --frozen-lockfile --ignore-scripts --filter frontend...

# Compilar packages compartidos + el frontend
RUN pnpm --filter @clinica-x/shared-types build \
 && pnpm --filter @clinica-x/shared-kernel build \
 && pnpm --filter @clinica-x/shared-middleware build \
 && pnpm --filter @clinica-x/date-utils build \
 && pnpm --filter frontend build

# --- Stage 2: runtime ---
FROM node:20-alpine AS runtime
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

ENV NODE_ENV=production

# Copiar artefactos compilados y node_modules necesarios
COPY --from=builder /workspace/pnpm-workspace.yaml /workspace/package.json ./
COPY --from=builder /workspace/packages ./packages
COPY --from=builder /workspace/frontend ./frontend
COPY --from=builder /workspace/node_modules ./node_modules

WORKDIR /app/frontend

# Ejecutar como usuario no-root por seguridad
USER node

# Puerto por defecto de Next.js en producción
EXPOSE 3100

CMD ["pnpm", "start"]
