FROM node:20-alpine AS base

# --- Dependencies ---
### Rebuild deps only when needed ###
FROM base AS deps
RUN apk add --no-cache libc6-compat git python3 make g++

RUN echo Building nextjs image with corepack

# Setup pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

# --- Builder ---
FROM base AS builder
RUN corepack enable
RUN corepack prepare pnpm@latest --activate 

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# --- Production runner ---
FROM base AS runner
# Set NODE_ENV to production
ENV NODE_ENV=production

# Disable Next.js telemetry
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Set correct permissions for nextjs user
# Don't run as root
RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 80
ENV PORT=80
ENV HOSTNAME=0.0.0.0

# Run the nextjs app
CMD ["pnpm", "start"]
### https://www.vorillaz.com/neaxtjs-docker-env