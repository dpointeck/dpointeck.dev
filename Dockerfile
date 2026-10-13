FROM oven/bun:1.4.3 AS base

ARG NEXT_PUBLIC_FATHOM_SITE_ID
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFY_ID

# Build stage
FROM base AS builder
ARG NEXT_PUBLIC_FATHOM_SITE_ID
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFY_ID
ENV VITE_FATHOM_SITE_ID=$NEXT_PUBLIC_FATHOM_SITE_ID
ENV VITE_GOOGLE_SITE_VERIFY_ID=$NEXT_PUBLIC_GOOGLE_SITE_VERIFY_ID
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app

RUN groupadd -r -g 1001 bunjs && \
    useradd -r -u 1001 -g bunjs appuser

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/_posts ./_posts

USER appuser
EXPOSE 3000
CMD ["bun", "run", ".output/server/index.mjs"]
