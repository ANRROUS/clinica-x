# =============================================================================
# file-service — Dockerfile multi-stage
# =============================================================================

FROM node:20-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages ./packages
COPY services/file-service ./services/file-service

RUN pnpm install --frozen-lockfile --filter file-service... || pnpm install --filter file-service...

RUN cd services/file-service && pnpm prisma generate

RUN pnpm --filter @clinica-x/shared-kernel build \
 && pnpm --filter @clinica-x/shared-types build \
 && pnpm --filter @clinica-x/shared-middleware build \
 && pnpm --filter file-service build

FROM node:20-alpine AS runtime
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

ENV NODE_ENV=production

COPY --from=builder /workspace/pnpm-workspace.yaml /workspace/package.json ./
COPY --from=builder /workspace/packages ./packages
COPY --from=builder /workspace/services/file-service ./services/file-service
COPY --from=builder /workspace/node_modules ./node_modules

WORKDIR /app/services/file-service

EXPOSE 3003

CMD ["node", "dist/server.js"]
