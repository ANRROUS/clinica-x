# =============================================================================
# ocr-service — Dockerfile multi-stage
# =============================================================================

FROM node:20-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages ./packages
COPY services/ocr-service ./services/ocr-service

RUN pnpm install --frozen-lockfile --filter ocr-service... || pnpm install --filter ocr-service...

RUN cd services/ocr-service && pnpm prisma generate

RUN pnpm --filter @clinica-x/date-utils build \
 && pnpm --filter @clinica-x/shared-kernel build \
 && pnpm --filter @clinica-x/shared-types build \
 && pnpm --filter @clinica-x/shared-middleware build \
 && pnpm --filter ocr-service build

FROM node:20-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

ENV NODE_ENV=production

COPY --from=builder /workspace/pnpm-workspace.yaml /workspace/package.json ./
COPY --from=builder /workspace/packages ./packages
COPY --from=builder /workspace/services/ocr-service ./services/ocr-service
COPY --from=builder /workspace/node_modules ./node_modules

WORKDIR /app/services/ocr-service

EXPOSE 3004

CMD ["node", "dist/server.js"]
