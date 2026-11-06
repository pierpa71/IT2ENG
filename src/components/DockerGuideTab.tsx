import React, { useState } from 'react';
import {
  Container,
  Terminal,
  Download,
  Copy,
  Check,
  Server,
  Network,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const DockerGuideTab: React.FC = () => {
  const [activeDockerFile, setActiveDockerFile] = useState<'compose' | 'node' | 'python'>('compose');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const DOCKER_COMPOSE_CONTENT = `services:
  # 1. Applicazione Web Principale (Node.js + React + Express)
  documorph-web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: documorph-web
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
      # Chiave opzionale se usi Gemini Cloud:
      - GEMINI_API_KEY=\${GEMINI_API_KEY:-}
    # Permette al container Docker di raggiungere Ollama o LM Studio sul tuo PC host
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped

  # 2. (Opzionale) Interfaccia Web Grafica Python Streamlit
  documorph-python:
    build:
      context: .
      dockerfile: Dockerfile.python
    container_name: documorph-python
    ports:
      - "8501:8501"
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY:-}
      - LOCAL_LLM_URL=http://host.docker.internal:11434/v1
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped
    profiles:
      - python
`;

  const DOCKERFILE_NODE = `# Multi-stage Dockerfile per DocuMorph AI Web Application
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json tsconfig.json server.ts ./
COPY python_app ./python_app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
`;

  const DOCKERFILE_PYTHON = `# Dockerfile per l'applicazione Python Streamlit
FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

COPY python_app/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY python_app/ ./

EXPOSE 8501

ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["streamlit", "run", "web_app.py", "--server.port=8501", "--server.address=0.0.0.0"]
`;

  const getCodeContent = () => {
    switch (activeDockerFile) {
      case 'compose':
        return DOCKER_COMPOSE_CONTENT;
      case 'node':
        return DOCKERFILE_NODE;
      case 'python':
        return DOCKERFILE_PYTHON;
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Container className="w-3.5 h-3.5" />
            <span>Docker & Docker Compose Ready</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Come installare ed eseguire l'app su Docker
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            DocuMorph AI include file Docker pronti per la compilazione e l'avvio immediato sia dell'interfaccia web principale (Node/React), sia dell'interfaccia Python Streamlit, già configurate per comunicare con <strong>Ollama</strong> o <strong>LM Studio</strong> sul tuo computer host.
          </p>
        </div>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Docker Compose */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Terminal className="w-4 h-4" />
              <span>Avvio con Docker Compose (1 comando)</span>
            </div>
            <button
              onClick={() => copyToClipboard('docker compose up --build -d', 'cmd-compose')}
              className="text-slate-400 hover:text-white p-1 rounded"
              title="Copia comando"
            >
              {copiedIndex === 'cmd-compose' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Compila ed esegue l'applicazione web completa in background su porta <strong>3000</strong>:
          </p>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-blue-300 border border-slate-800 flex items-center justify-between">
            <code>docker compose up --build -d</code>
          </div>
          <p className="text-[11px] text-slate-500">
            Poi apri il browser su: <code className="text-slate-300 font-mono">http://localhost:3000</code>
          </p>
        </div>

        {/* Step 2: Standalone Docker */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Container className="w-4 h-4" />
              <span>Avvio con Docker Standalone</span>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  'docker build -t documorph .\ndocker run -d -p 3000:3000 --add-host=host.docker.internal:host-gateway documorph',
                  'cmd-standalone'
                )
              }
              className="text-slate-400 hover:text-white p-1 rounded"
              title="Copia comandi"
            >
              {copiedIndex === 'cmd-standalone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Se preferisci usare i comandi <code className="text-slate-300">docker build</code> e <code className="text-slate-300">docker run</code>:
          </p>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-indigo-300 border border-slate-800 space-y-1">
            <div>docker build -t documorph .</div>
            <div>docker run -d -p 3000:3000 --add-host=host.docker.internal:host-gateway documorph</div>
          </div>
        </div>
      </div>

      {/* Networking Tip Card (Crucial for Local LLMs) */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <Network className="w-4 h-4 text-amber-400" />
          <span>Regola Fondamentale per Collegare l'LLM Locale da Docker</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Quando l'applicazione gira all'interno di un container Docker, <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded font-mono">localhost</code> si riferisce all'interno del container stesso. Per raggiungere il server Ollama o LM Studio installato sul tuo computer host, usa:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400">Per Ollama su PC Host:</span>
            <div className="font-mono text-xs text-emerald-300">
              http://host.docker.internal:11434/v1
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400">Per LM Studio su PC Host:</span>
            <div className="font-mono text-xs text-emerald-300">
              http://host.docker.internal:1234/v1
            </div>
          </div>
        </div>

        <div className="text-[11px] text-amber-400/90 flex items-center gap-1.5 pt-1">
          <span>
            💡 Il flag <code className="text-white font-mono">--add-host=host.docker.internal:host-gateway</code> (già presente in <code className="text-white font-mono">docker-compose.yml</code>) è ciò che rende possibile questa comunicazione.
          </span>
        </div>
      </div>

      {/* File Inspector & Download */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveDockerFile('compose')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDockerFile === 'compose'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              docker-compose.yml
            </button>

            <button
              onClick={() => setActiveDockerFile('node')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDockerFile === 'node'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dockerfile (Web App)
            </button>

            <button
              onClick={() => setActiveDockerFile('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDockerFile === 'python'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dockerfile.python (Streamlit)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                downloadFile(
                  getCodeContent(),
                  activeDockerFile === 'compose'
                    ? 'docker-compose.yml'
                    : activeDockerFile === 'node'
                    ? 'Dockerfile'
                    : 'Dockerfile.python'
                )
              }
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Scarica File</span>
            </button>

            <button
              onClick={() => copyToClipboard(getCodeContent(), 'code-viewer')}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all"
            >
              {copiedIndex === 'code-viewer' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 'code-viewer' ? 'Copiato!' : 'Copia'}</span>
            </button>
          </div>
        </div>

        <pre className="p-6 font-mono text-xs text-slate-300 bg-slate-950/95 overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto">
          <code>{getCodeContent()}</code>
        </pre>
      </div>
    </div>
  );
};
