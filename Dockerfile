FROM node:20-alpine

RUN npm install -g pnpm

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
