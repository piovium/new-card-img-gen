FROM ghcr.io/pnpm/pnpm:latest AS build
RUN pnpm runtime set node 26 -g
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build
ENV NODE_ENV=production
EXPOSE 1337 3000
CMD ["pnpm", "start"]
