# =============================================================================
# clinical-service — Dockerfile multi-stage
# =============================================================================

FROM node:20-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages ./packages
COPY services/clinical-service ./services/clinical-service

RUN pnpm install --frozen-lockfile --filter clinical-service... || pnpm install --filter clinical-service...

RUN cd services/clinical-service && pnpm prisma generate

RUN pnpm --filter @clinica-x/shared-kernel build \
 && pnpm --filter @clinica-x/shared-types build \
 && pnpm --filter @clinica-x/shared-middleware build \
 && pnpm --filter clinical-service build

FROM node:20-alpine AS runtime
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

ENV NODE_ENV=production

COPY --from=builder /workspace/pnpm-workspace.yaml /workspace/package.json ./
COPY --from=builder /workspace/packages ./packages
COPY --from=builder /workspace/services/clinical-service ./services/clinical-service
COPY --from=builder /workspace/node_modules ./node_modules

WORKDIR /app/services/clinical-service

EXPOSE 3002

CMD ["node", "dist/server.js"]
