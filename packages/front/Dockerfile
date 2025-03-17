FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack install -g pnpm@10.6.3
WORKDIR /workspace

FROM base AS

