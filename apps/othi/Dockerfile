FROM node:20-alpine AS base
# Set working directory
WORKDIR /app

# config pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable pnpm
RUN pnpm add -g turbo
# TODO: probably better to use copy env
ARG TIPTAP_PRO_TOKEN
ARG NEXTAUTH_SECRET
ARG EDGE_CONFIG
ARG DB_URL
ARG DB_AUTH_TOKEN
ARG NEXT_PUBLIC_HOST_HSR
ARG OTHI_GITHUB_SECRET
ARG OTHI_GITHUB_ID
ARG NEXTAUTH_SECRET
ARG ADMIN_IDENT
ARG AUTH_GITHUB_IDENT
ARG UPLOADTHING_TOKEN
ARG NEXT_PUBLIC_HOST_NAS_WS
ARG GITHUB_ID
ARG GITHUB_SECRET
ARG NEXTAUTH_URL

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat

COPY . .
# RUN pnpm add -g turbo
RUN pnpm dlx turbo prune othi --docker

# Add lockfile and package.json's of isolated subworkspace

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm -w setup:registry_ci
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN turbo build --filter=othi

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/othi/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/othi/.next/static ./apps/othi/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/othi/public ./apps/othi/public

# alleviate libsql error, remove when issue is fixed
# https://github.com/tursodatabase/libsql-client-ts/issues/295
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD node apps/othi/server.js
