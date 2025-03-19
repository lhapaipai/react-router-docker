# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack install -g pnpm@10.6.3

FROM base AS builder
WORKDIR /workspace
COPY ./.npmrc ./pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
COPY . ./
RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm deploy --filter=front --prod /front

FROM base AS front
WORKDIR /front
COPY --from=builder /front ./
USER node
CMD ["./node_modules/.bin/react-router-serve", "./build/server/index.js"]

# bien penser à la propriété files du package.json de front
# voir : files included in the deployed project
# https://pnpm.io/next/cli/deploy#files-included-in-the-deployed-project