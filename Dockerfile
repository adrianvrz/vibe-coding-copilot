# -----------------------------------------------------------------------------
# Dockerfile for a Next.js application supporting multiple package managers.
#
# Stages:
#   1. base:      Uses official Node.js 22 Alpine image as the base.
#   2. deps:      Installs libc6-compat and project dependencies using yarn, npm, or pnpm,
#                 depending on which lockfile is present.
#   3. builder:   Copies source code and builds the Next.js app using the detected package manager.
#   4. runner:    Prepares a minimal production image, sets up a non-root user,
#                 copies only necessary build artifacts, and sets permissions.
#
# Features:
#   - Multi-stage build for smaller production images.
#   - Automatic detection of package manager via lockfile.
#   - Output file tracing for minimal runtime dependencies.
#   - Non-root user for improved security.
#   - Optional disabling of Next.js telemetry via environment variable.
#
# Usage:
#   - Build:   docker build -t my-nextjs-app .
#   - Run:     docker run -p 3000:3000 my-nextjs-app
#
# References:
#   - Next.js Standalone Output: https://nextjs.org/docs/pages/api-reference/next-config-js/output
#   - Output File Tracing: https://nextjs.org/docs/advanced-features/output-file-tracing
#   - Node.js Docker Image: https://github.com/nodejs/docker-node
# -----------------------------------------------------------------------------
# Build arguments for versioning (with defaults)
ARG VERSION=1.0.0
ARG BUILD_DATE=""
ARG VCS_REF="unknown"

# Use official Node.js 22 image as the base
FROM node:22-alpine AS base
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Re-declare ARGs for this stage
ARG VERSION=1.0.0
ARG BUILD_DATE=""
ARG VCS_REF="unknown"

ENV NODE_ENV=production
ENV PORT=3000
# Add version information as environment variables
ENV APP_VERSION=${VERSION}
ENV BUILD_DATE=${BUILD_DATE}
ENV VCS_REF=${VCS_REF}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Add comprehensive image labels for better image management and metadata
LABEL version="${VERSION}" \
      build-date="${BUILD_DATE}" \
      vcs-ref="${VCS_REF}" \
      org.opencontainers.image.title="Vibe Coding Copilot" \
      org.opencontainers.image.description="Next.js 15 weather application with TypeScript and Tailwind CSS" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.source="https://github.com/your-username/vibe-coding-copilot" \
      org.opencontainers.image.url="https://github.com/your-username/vibe-coding-copilot" \
      org.opencontainers.image.vendor="Vibe Coding" \
      org.opencontainers.image.licenses="MIT"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
# If your standalone build outputs 'server.js' in the root, this is correct.
# If not, update the entry point to match the actual output (e.g., 'main.js' or 'index.js').
CMD ["node", "server.js"]