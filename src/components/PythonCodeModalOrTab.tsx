import React, { useState, useEffect } from 'react';
import {
  Code2,
  Terminal,
  Download,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const PythonCodeModalOrTab: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'cli' | 'streamlit' | 'requirements' | 'guide'>('cli');
  const [copied, setCopied] = useState<boolean>(false);
  const [pythonData, setPythonData] = useState<{
    cliScript: string;
    requirements: string;
    streamlitApp: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/python-code')
      .then((res) => res.json())
      .then((data) => setPythonData(data))
      .catch((err) => console.error('Error fetching python code:', err));
  }, []);

  const getActiveCode = () => {
    if (!pythonData) return '# Caricamento codice in corso...';
    switch (activeFile) {
      case 'cli':
        return pythonData.cliScript;
      case 'streamlit':
        return pythonData.streamlitApp;
      case 'requirements':
        return pythonData.requirements;
      case 'guide':
        return `# GUIDA RAPIDA DI AVVIO LOCALE IN PYTHON

# 1. Crea l'ambiente virtuale
python3 -m venv venv
source venv/bin/activate  # Su Windows: venv\\Scripts\\activate

# 2. Installa le dipendenze
pip install -r requirements.txt

# 3. Avvia l'endpoint locale (es. Ollama o LM Studio)
# Per Ollama:
# ollama run llama3

# 4A. Avvia l'interfaccia grafica web Streamlit con campo Endpoint URL:
streamlit run web_app.py

# 4B. Oppure esegui la traduzione da riga di comando (CLI):
# Con Ollama locale:
python doc_translator.py contratto.docx -e http://localhost:11434/v1 -m llama3 -o contratto_EN.docx

# Con LM Studio locale:
python doc_translator.py bilancio.pdf -e http://localhost:1234/v1 -m default -o bilancio_EN.pdf

# Con file ASCII:
python doc_translator.py specifiche.txt -e http://localhost:11434/v1 -m llama3 -o specifiche_EN.txt
`;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = 'doc_translator.py';
    let mime = 'text/x-python';
    if (activeFile === 'streamlit') filename = 'web_app.py';
    else if (activeFile === 'requirements') {
      filename = 'requirements.txt';
      mime = 'text/plain';
    } else if (activeFile === 'guide') {
      filename = 'GUIDA_PYTHON.txt';
      mime = 'text/plain';
    }

    const blob = new Blob([getActiveCode()], { type: mime });
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
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Python 3.10+ & Streamlit Web GUI & CLI</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Architettura & Codice Sorgente Python
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Come richiesto, abbiamo sviluppato l'intero modulo di traduzione e ricostruzione impaginazione in <strong>Python puro</strong>. Puoi eseguire l'interfaccia grafica moderna sul tuo PC con <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-xs">streamlit run web_app.py</code> oppure utilizzare lo script CLI per tradurre documenti da terminale in modalità batch.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Scarica File Corrente</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiato!' : 'Copia negli Appunti'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* File Tabs */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveFile('cli')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                activeFile === 'cli'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>doc_translator.py (CLI & Motore)</span>
            </button>

            <button
              onClick={() => setActiveFile('streamlit')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                activeFile === 'streamlit'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>web_app.py (GUI Web Streamlit)</span>
            </button>

            <button
              onClick={() => setActiveFile('requirements')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                activeFile === 'requirements'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>requirements.txt</span>
            </button>

            <button
              onClick={() => setActiveFile('guide')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                activeFile === 'guide'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Guida Esecuzione</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-slate-500">
              Linguaggio: Python 3.10+
            </span>
          </div>
        </div>

        {/* Code Content */}
        <div className="relative">
          <pre className="p-6 font-mono text-xs text-slate-300 bg-slate-950/95 overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto selection:bg-emerald-500/30">
            <code>{getActiveCode()}</code>
          </pre>
        </div>
      </div>

      {/* Feature Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Code2 className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">Microsoft Word (.docx)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Utilizza la libreria <code className="text-indigo-300">python-docx</code> per iterare sui paragrafi, individuare gli stili di titolo H1, H2, H3 ed estrarre le tabelle cella per cella, ricostruendo poi un documento DOCX identico con le medesime proprietà.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">Documenti PDF (.pdf)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Utilizza <code className="text-indigo-300">pypdf</code> e <code className="text-indigo-300">reportlab</code> combinati con l'analisi multimodale di Gemini per conservare la suddivisione in pagine, i margini e le sezioni numerate.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">ASCII & Fixed-Width (.asc/.txt)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mantiene l'allineamento dei caratteri monospazio, le cornici a caratteri ASCII (<code className="text-emerald-300">+---+</code> e <code className="text-emerald-300">|</code>) e l'indentazione ad albero dei diagrammi di sistema.
          </p>
        </div>
      </div>
    </div>
  );
};
