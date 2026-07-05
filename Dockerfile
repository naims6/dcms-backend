FROM node:24-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./


RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm build

# production build
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

# copy from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

CMD ["node", "dist/server.js"]