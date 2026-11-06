# Multi-stage Dockerfile per DocuMorph AI Web Application
# Utilizziamo node:22-slim (Debian) per piena compatibilità con i binari nativi di Tailwind CSS v4 ed esbuild
FROM node:22-slim AS builder

WORKDIR /app

# Copia i descrittori di dipendenze
COPY package*.json tsconfig.json ./

# Installazione dipendenze con --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copia l'intero sorgente del progetto (rispetta .dockerignore)
COPY . .

# Compilazione del frontend React con Vite
RUN npm run build

# Stage di produzione finale
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia configurazioni e codice server
COPY package*.json tsconfig.json server.ts ./
COPY python_app ./python_app

# Copia le dipendenze risolte dallo stage builder (zero conflitti e riutilizzo cache)
COPY --from=builder /app/node_modules ./node_modules

# Copia il frontend React compilato in dist/
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Avvio del server Node.js full-stack su porta 3000
CMD ["npm", "start"]
