import React from 'react';
import { BookOpen, CheckCircle, FileText, FileCode, Layers, Shield, Sparkles } from 'lucide-react';

export const DocsModalOrTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Come DocuMorph AI preserva l'impaginazione originale
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Mantenere la stessa struttura visiva durante la traduzione verso l'inglese è fondamentale per contratti, bilanci, manuali tecnici e relazioni aziendali.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Microsoft Word (.docx)</h3>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Preserva i livelli di intestazione Heading 1, 2 e 3</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Celle di tabelle con bordi, sfondo di testata e allineamento</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Elenchi puntati, numerati e grassetti contrattuali</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Documenti PDF (.pdf)</h3>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Analisi visiva diretta via Gemini Multimodal</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Ricostruzione geometrica di colonne e box di avviso</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Esportazione diretta in PDF stampabile o DOCX compatibile</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">ASCII & Plain Text (.asc/.txt)</h3>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Rispetto maniacale del numero di spazi e tabulazioni</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Ricalcolo delle larghezze delle cornici ASCII (+---+ e |)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Conservazione di diagrammi di rete e schemi testuali</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Consigli per una resa ottimale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <strong className="text-slate-200 block mb-1">Glossario Personalizzato</strong>
            Se hai sigle aziendali (es. SAL, PFN, C.d.A., PEC), inseriscile nel campo "Glossario Termini" per forzare la resa inglese preferita (es. SLA, EBIT, Board of Directors, Certified Email).
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <strong className="text-slate-200 block mb-1">Scelta del Dialetto</strong>
            Scegli <em>American English (US)</em> per contratti e standard internazionali, oppure <em>British English (UK)</em> per partner europei e della confederazione del Commonwealth.
          </div>
        </div>
      </div>
    </div>
  );
};
