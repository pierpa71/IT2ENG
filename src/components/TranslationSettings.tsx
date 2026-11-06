import React from 'react';
import { Sliders, Languages, ShieldCheck, ArrowRight, Table as TableIcon, Sparkles } from 'lucide-react';
import { TranslationOptions } from '../types';
import { LLMEndpointConfig } from './LLMEndpointConfig';

interface TranslationSettingsProps {
  options: TranslationOptions;
  setOptions: React.Dispatch<React.SetStateAction<TranslationOptions>>;
  onTranslate: () => void;
  isLoading: boolean;
  canTranslate: boolean;
}

export const TranslationSettings: React.FC<TranslationSettingsProps> = ({
  options,
  setOptions,
  onTranslate,
  isLoading,
  canTranslate,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Local LLM Endpoint Configuration (OpenAI Compatible) */}
      <LLMEndpointConfig options={options} setOptions={setOptions} />

      {/* 2. Translation & Layout Options */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Parametri di Traduzione & Layout
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Preservazione Strutturale Attiva
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Dialect */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              Dialetto Inglese
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOptions((prev) => ({ ...prev, dialect: 'US' }))}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  options.dialect === 'US'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                🇺🇸 American (US)
              </button>
              <button
                type="button"
                onClick={() => setOptions((prev) => ({ ...prev, dialect: 'UK' }))}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  options.dialect === 'UK'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                🇬🇧 British (UK)
              </button>
            </div>
          </div>

          {/* Tone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Registro & Stile Linguistico
            </label>
            <select
              value={options.tone}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  tone: e.target.value as TranslationOptions['tone'],
                }))
              }
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="professional">Professionale & Business (Consigliato)</option>
              <option value="technical">Tecnico / IT / Ingegneristico</option>
              <option value="academic">Accademico / Scientifico</option>
              <option value="legal">Legale / Contrattuale / Formale</option>
              <option value="conversational">Colloquiale / Divulgativo</option>
            </select>
          </div>

          {/* Layout Preserves */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-indigo-400" />
              Vincoli di Impaginazione
            </label>
            <div className="flex items-center gap-2 pt-1">
              <label className="relative flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={options.preserveTables}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, preserveTables: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-slate-300">
                  Righe, colonne & tabelle identiche
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Optional custom glossary */}
        <div className="pt-1">
          <label className="text-xs font-semibold text-slate-400 block mb-1">
            Glossario Termini o Nomi da Preservare (Opzionale):
          </label>
          <input
            type="text"
            value={options.customGlossary}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, customGlossary: e.target.value }))
            }
            placeholder="Es: Mantieni 'Nexus Systems', 'SAL' -> 'Milestone Deliverable', non tradurre gli indirizzi..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Action CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>
              Traduzione con {options.provider === 'local-openai' ? `LLM locale (${options.modelName})` : 'Gemini Cloud'} con preservazione geometrica.
            </span>
          </div>

          <button
            type="button"
            disabled={!canTranslate || isLoading}
            onClick={onTranslate}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Ricostruzione & Traduzione in corso...</span>
              </>
            ) : (
              <>
                <span>Avvia Traduzione con LLM {options.provider === 'local-openai' ? 'Locale' : 'Cloud'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
