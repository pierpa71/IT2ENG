import React, { useState } from 'react';
import {
  Server,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Key,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { TranslationOptions } from '../types';

interface LLMEndpointConfigProps {
  options: TranslationOptions;
  setOptions: React.Dispatch<React.SetStateAction<TranslationOptions>>;
}

export const LLMEndpointConfig: React.FC<LLMEndpointConfigProps> = ({
  options,
  setOptions,
}) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'idle';
    text: string;
    models?: string[];
  }>({
    type: 'idle',
    text: '',
  });

  const PRESETS = [
    { label: 'Ollama', url: 'http://localhost:11434/v1', defaultModel: 'llama3' },
    { label: 'LM Studio', url: 'http://localhost:1234/v1', defaultModel: 'default' },
    { label: 'vLLM / LocalAI', url: 'http://localhost:8000/v1', defaultModel: 'llama3' },
    { label: '🐳 Docker Host (Ollama)', url: 'http://host.docker.internal:11434/v1', defaultModel: 'llama3' },
  ];

  const handleSelectPreset = (url: string, defaultModel: string) => {
    setOptions((prev) => ({
      ...prev,
      endpointUrl: url,
      modelName: prev.modelName || defaultModel,
    }));
    setStatusMessage({ type: 'idle', text: '' });
  };

  const handleCheckConnection = async () => {
    try {
      setIsChecking(true);
      setStatusMessage({ type: 'idle', text: 'Connessione all\'endpoint in corso...' });

      const resp = await fetch('/api/check-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpointUrl: options.endpointUrl,
          apiKey: options.apiKey,
        }),
      });

      const data = await resp.json();

      if (data.success && data.connected) {
        setStatusMessage({
          type: 'success',
          text: data.message || `Connesso con successo!`,
          models: data.models,
        });

        // If models were detected and current model isn't in list, select the first
        if (data.models && data.models.length > 0 && !data.models.includes(options.modelName)) {
          setOptions((prev) => ({ ...prev, modelName: data.models[0] }));
        }
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Impossibile connettersi all\'endpoint specificato.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Errore durante il test: ${err.message}`,
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-xl shadow-indigo-950/20">
      {/* Header & Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              Endpoint LLM Locale (Compatibile OpenAI)
            </h3>
            <p className="text-[11px] text-slate-400">
              Collega l'applicazione direttamente alla tua istanza locale di Ollama, LM Studio o vLLM
            </p>
          </div>
        </div>

        {/* Provider Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setOptions((prev) => ({ ...prev, provider: 'local-openai' }))}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              options.provider === 'local-openai'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-300" />
            <span>LLM Locale (OpenAI API)</span>
          </button>

          <button
            type="button"
            onClick={() => setOptions((prev) => ({ ...prev, provider: 'gemini' }))}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              options.provider === 'gemini'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Gemini Cloud</span>
          </button>
        </div>
      </div>

      {options.provider === 'local-openai' ? (
        <div className="space-y-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">
              Preset veloci:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSelectPreset(p.url, p.defaultModel)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  options.endpointUrl === p.url
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Endpoint URL Input & Verification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                URL Endpoint Compatibile OpenAI
                <span className="text-[10px] text-indigo-400 font-mono">(es. Ollama, LM Studio)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={options.endpointUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOptions((prev) => ({ ...prev, endpointUrl: val }));
                    setStatusMessage({ type: 'idle', text: '' });
                  }}
                  placeholder="http://localhost:11434/v1"
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Model Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Nome Modello
              </label>
              {statusMessage.models && statusMessage.models.length > 0 ? (
                <select
                  value={options.modelName}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, modelName: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                >
                  {statusMessage.models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={options.modelName}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, modelName: e.target.value }))
                  }
                  placeholder="llama3, mistral, qwen2.5..."
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Test Connection Button & Optional API Key */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCheckConnection}
                disabled={isChecking || !options.endpointUrl}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-indigo-400' : ''}`} />
                <span>{isChecking ? 'Verifica in corso...' : 'Verifica Connessione Endpoint'}</span>
              </button>
            </div>

            {/* Optional API Key for secured local proxies */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Key className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="password"
                value={options.apiKey || ''}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, apiKey: e.target.value }))
                }
                placeholder="API Key (opzionale)"
                className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-mono w-40 focus:outline-none focus:border-slate-700"
              />
            </div>
          </div>

          {/* Status Feedback Banner */}
          {statusMessage.type === 'success' && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-200 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Connessione Stabilita:</strong> {statusMessage.text}
                {statusMessage.models && statusMessage.models.length > 0 && (
                  <div className="mt-1 text-[11px] text-emerald-300 font-mono">
                    Modelli disponibili: {statusMessage.models.slice(0, 6).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {statusMessage.type === 'error' && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block text-amber-100 font-semibold">
                  Avviso Endpoint Locale
                </strong>
                <span>{statusMessage.text}</span>
                <p className="text-[11px] text-amber-300/80">
                  💡 <strong>Suggerimento</strong>: Se usi <em>Ollama</em>, assicurati di aver abilitato l'accesso avviandolo con <code className="bg-slate-900 px-1 py-0.5 rounded font-mono text-[10px]">OLLAMA_ORIGINS="*" ollama serve</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3 flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>
              Modalità Cloud attiva: utilizza il modello <strong>Gemini 3.8 Flash</strong> integrato nel server.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
