# =============================================================================
# auth-service — Dockerfile multi-stage
# =============================================================================
# Stage 1 (builder): instala todas las deps y compila TypeScript
# Stage 2 (runtime): solo runtime + deps de producción + artifacts compilados
# =============================================================================

# --- Stage 1: builder ---
FROM node:20-alpine AS builder
WORKDIR /workspace

# Habilitar pnpm vía corepack
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copiar manifests del monorepo
COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages ./packages
COPY services/auth-service ./services/auth-service

# Instalar dependencias del workspace (filtrando)
RUN pnpm install --frozen-lockfile --filter auth-service... || pnpm install --filter auth-service...

# Generar cliente Prisma
RUN cd services/auth-service && pnpm prisma generate

# Compilar packages compartidos + el servicio
RUN pnpm --filter @clinica-x/shared-kernel build \
 && pnpm --filter @clinica-x/shared-types build \
 && pnpm --filter @clinica-x/shared-middleware build \
 && pnpm --filter auth-service build

# --- Stage 2: runtime ---
FROM node:20-alpine AS runtime
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

ENV NODE_ENV=production

# Copiar artefactos compilados y node_modules necesarios
COPY --from=builder /workspace/pnpm-workspace.yaml /workspace/package.json ./
COPY --from=builder /workspace/packages ./packages
COPY --from=builder /workspace/services/auth-service ./services/auth-service
COPY --from=builder /workspace/node_modules ./node_modules

WORKDIR /app/services/auth-service

EXPOSE 3000

CMD ["node", "dist/server.js"]
