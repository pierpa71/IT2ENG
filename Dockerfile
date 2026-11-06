# Multi-stage Dockerfile per DocuMorph AI Web Application
FROM node:22-alpine AS builder

WORKDIR /app

# Copia file di configurazione dipendenze
COPY package*.json tsconfig.json vite.config.ts index.html ./
COPY src ./src

# Installazione dipendenze e build del frontend React
RUN npm install
RUN npm run build

# Stage di produzione
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev
RUN npm install -g tsx

# Copia build del frontend e file del server
COPY --from=builder /app/dist ./dist
COPY server.ts tsconfig.json ./
COPY python_app ./python_app

EXPOSE 3000

CMD ["tsx", "server.ts"]
