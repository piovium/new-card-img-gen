FROM ghcr.io/pnpm/pnpm:latest AS build

RUN pnpm runtime set node 26 -g \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build

ENV NODE_ENV=production \
    CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 1337 3000
CMD ["pnpm", "start"]
