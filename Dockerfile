FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack install -g pnpm@10.6.3
WORKDIR /workspace

FROM base AS development-dependencies-env
COPY ./.npmrc ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

FROM base AS production-dependencies-env
COPY ./.npmrc ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch --prod

FROM base AS build-env
COPY . ./
COPY --from=development-dependencies-env /workspace/node_modules ./node_modules
RUN pnpm install --offline
RUN pnpm run build

FROM base
COPY  ./.npmrc ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY  ./packages/front/package.json ./packages/front/
COPY  ./packages/pentatrion-design/package.json ./packages/pentatrion-design/

COPY --from=production-dependencies-env /workspace/node_modules ./node_modules
COPY --from=build-env /workspace/packages/front/build ./packages/front/build
RUN pnpm install --offline --prod

# node user
USER 1000  

CMD ["pnpm", "run", "start"]

