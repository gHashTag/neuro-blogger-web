FROM node:20-alpine AS base

# --- Dependencies ---
### Rebuild deps only when needed ###
FROM base AS deps
RUN apk add --no-cache libc6-compat git python3 make g++

WORKDIR /app

COPY package.json ./
RUN npm install

# --- Builder ---
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

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
CMD ["npm", "start"]
### https://www.vorillaz.com/neaxtjs-docker-env