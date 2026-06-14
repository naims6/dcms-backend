FROM node:22-alpine

RUN npm install -g pnpm@9

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile 

COPY . .

# dummy database url to generate prisma client
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN pnpm prisma generate

RUN pnpm run build

EXPOSE 5000

CMD ["sh", "-c", "pnpm run prisma:deploy && node dist/server.js"]

# # Builder
# FROM node:22-alpine AS builder

# RUN npm install -g pnpm

# WORKDIR /app

# COPY package.json pnpm-lock.yaml ./

# COPY pnpm-workspace.yaml ./

# RUN pnpm approve-builds @prisma/engines bcrypt esbuild prisma

# RUN pnpm install --frozen-lockfile

# COPY . .

# ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/mydb?schema=public

# RUN pnpm prisma generate
# RUN pnpm run build

# # RUN pnpm prune --prod

# # Runner
# FROM node:22-alpine

# RUN npm install -g pnpm

# WORKDIR /app

# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/prisma.config.ts ./
# COPY --from=builder /app/pnpm-workspace.yaml ./
# COPY --from=builder /app/swagger.yml ./

# # RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# EXPOSE 5000

# CMD ["sh", "-c", "pnpm run prisma:deploy && node dist/server.js"]
