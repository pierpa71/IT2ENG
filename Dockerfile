# Multi-stage Dockerfile per DocuMorph AI Web Application
FROM node:22-alpine AS builder

WORKDIR /app

# Copia file di configurazione
COPY package*.json tsconfig.json vite.config.ts index.html ./
COPY src ./src

# Installazione dipendenze con --legacy-peer-deps per gestire i peer-deps di React 19 e build Vite
RUN npm install --legacy-peer-deps
RUN npm run build

# Stage di produzione finale
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia configurazioni e codice server
COPY package*.json tsconfig.json server.ts ./
COPY python_app ./python_app

# Copia le dipendenze risolte dallo stage builder (evita fallimenti di rete o conflitti ERESOLVE)
COPY --from=builder /app/node_modules ./node_modules

# Copia il frontend React compilato
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Avvia il server Node.js full-stack su porta 3000
CMD ["npm", "start"]
