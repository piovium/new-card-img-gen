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
ARG DATA_CODE_ANALYZER_RESULT_ENDPOINT=https://play.piovium.org/api/data_code_analyzer_result
ARG ASSETS_MANAGER_OPTIONS={}
ENV DATA_CODE_ANALYZER_RESULT_ENDPOINT=$DATA_CODE_ANALYZER_RESULT_ENDPOINT
ENV ASSETS_MANAGER_OPTIONS=$ASSETS_MANAGER_OPTIONS
RUN pnpm install --frozen-lockfile && pnpm build

ENV NODE_ENV=production \
    CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 3000
CMD ["pnpm", "start"]
