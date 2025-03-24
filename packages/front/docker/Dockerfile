# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_DEFAULT_TO_LATEST=0

RUN corepack enable && corepack prepare pnpm@latest-10 --activate

FROM base AS builder
WORKDIR /workspace

COPY --from=workspace ./.npmrc ./pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
COPY --from=workspace . ./
RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm deploy --filter=front --prod /front

COPY --from=workspace ./packages/database/prisma /front/
RUN cd /front && pnpm prisma generate

FROM base AS front
WORKDIR /front
COPY --from=builder /front ./
COPY ./docker-entrypoint.sh /usr/local/bin/
USER node
EXPOSE 3000
CMD ["./node_modules/.bin/react-router-serve", "./build/server/index.js"]

# bien penser à la propriété files du package.json de front
# voir : files included in the deployed project
# https://pnpm.io/next/cli/deploy#files-included-in-the-deployed-project