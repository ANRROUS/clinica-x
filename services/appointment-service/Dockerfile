# =============================================================================
# appointment-service — Dockerfile multi-stage
# =============================================================================

FROM node:20-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages ./packages
COPY services/appointment-service ./services/appointment-service

RUN pnpm install --frozen-lockfile --filter appointment-service... || pnpm install --filter appointment-service...

RUN cd services/appointment-service && pnpm prisma generate

RUN pnpm --filter @clinica-x/date-utils build \
 && pnpm --filter @clinica-x/shared-kernel build \
 && pnpm --filter @clinica-x/shared-types build \
 && pnpm --filter @clinica-x/shared-middleware build \
 && pnpm --filter appointment-service build

FROM node:20-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

ENV NODE_ENV=production

COPY --from=builder /workspace/pnpm-workspace.yaml /workspace/package.json ./
COPY --from=builder /workspace/packages ./packages
COPY --from=builder /workspace/services/appointment-service ./services/appointment-service
COPY --from=builder /workspace/node_modules ./node_modules

WORKDIR /app/services/appointment-service

EXPOSE 3001

CMD ["node", "dist/server.js"]
