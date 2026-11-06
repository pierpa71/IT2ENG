import React, { useEffect, useState } from 'react';
import { Sparkles, Layers, FileSearch, CheckCircle2 } from 'lucide-react';

export const ProgressIndicator: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'Estrazione del contenuto e analisi del formato', desc: 'Rilevamento font, margini e suddivisione' },
    { label: 'Ispezione della geometria di tabelle e gerarchie', desc: 'Analisi titoli H1/H2/H3, griglie e colonne' },
    { label: 'Traduzione semantica in inglese con Gemini 3.8 Flash', desc: 'Adattamento terminologico e registro stilistico' },
    { label: 'Ricostruzione e formattazione fedele del layout', desc: 'Allineamento bordi, tabelle ed elenchi' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1200);
    const timer2 = setTimeout(() => setStep(2), 2800);
    const timer3 = setTimeout(() => setStep(3), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl shadow-indigo-950/20 max-w-2xl mx-auto my-6 text-center">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 animate-pulse">
        <Sparkles className="w-6 h-6" />
      </div>

      <div>
        <h3 className="text-base font-bold text-white">
          Elaborazione del documento in corso...
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          L'intelligenza artificiale sta traducendo il testo garantendo che l'impaginazione rimanga identica.
        </p>
      </div>

      <div className="space-y-3 text-left">
        {steps.map((s, index) => {
          const isDone = step > index;
          const isCurrent = step === index;

          return (
            <div
              key={index}
              className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                isCurrent
                  ? 'bg-indigo-600/15 border-indigo-500/50 shadow-sm'
                  : isDone
                  ? 'bg-slate-950/60 border-emerald-500/30 text-slate-300'
                  : 'bg-slate-950/30 border-slate-800/60 text-slate-500 opacity-60'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                    {index + 1}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-indigo-200' : isDone ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {s.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
