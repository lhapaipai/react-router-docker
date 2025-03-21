FROM node:22-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:$PATH"
RUN corepack enable && corepack install -g pnpm@10.6.3

WORKDIR /app
ADD ./package.json ./

RUN pnpm install

CMD ["pnpm", "run", "db:migrate"]