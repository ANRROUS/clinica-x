# =============================================================================
# api-gateway — Dockerfile multi-stage
# =============================================================================

FROM node:20-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages ./packages
COPY services/api-gateway ./services/api-gateway

RUN pnpm install --frozen-lockfile --filter api-gateway... || pnpm install --filter api-gateway...

RUN pnpm --filter @clinica-x/shared-types build \
 && pnpm --filter @clinica-x/shared-kernel build \
 && pnpm --filter @clinica-x/shared-middleware build \
 && pnpm --filter api-gateway build

FROM node:20-alpine AS runtime
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

ENV NODE_ENV=production

COPY --from=builder /workspace/pnpm-workspace.yaml /workspace/package.json ./
COPY --from=builder /workspace/packages ./packages
COPY --from=builder /workspace/services/api-gateway ./services/api-gateway
COPY --from=builder /workspace/node_modules ./node_modules

WORKDIR /app/services/api-gateway

EXPOSE 8080

CMD ["node", "dist/server.js"]
