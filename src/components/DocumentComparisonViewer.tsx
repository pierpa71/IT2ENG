import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Copy,
  Printer,
  FileCode,
  Check,
  Split,
  Eye,
  Layers,
  ArrowRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { DocumentFile, TranslationResult } from '../types';
import { downloadTranslatedDocx } from '../utils/docxExporter';

interface DocumentComparisonViewerProps {
  originalFile: DocumentFile;
  result: TranslationResult;
}

export const DocumentComparisonViewer: React.FC<DocumentComparisonViewerProps> = ({
  originalFile,
  result,
}) => {
  const [viewMode, setViewMode] = useState<'paper' | 'ascii' | 'split-diff'>('paper');
  const [syncScroll, setSyncScroll] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadingDocx, setDownloadingDocx] = useState<boolean>(false);

  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (!syncScroll || !targetRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const ratio = scrollTop / (scrollHeight - clientHeight || 1);
    const targetScrollHeight = targetRef.current.scrollHeight - targetRef.current.clientHeight;
    targetRef.current.scrollTop = ratio * targetScrollHeight;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.translatedPlainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([result.translatedPlainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const cleanName = originalFile.name.replace(/\.[^/.]+$/, '');
    a.href = url;
    a.download = `${cleanName}_translated_EN.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWord = async () => {
    try {
      setDownloadingDocx(true);
      await downloadTranslatedDocx(result, originalFile.name);
    } catch (err) {
      console.error('Error generating docx:', err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Metrics & Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 no-print shadow-lg">
        {/* Left: Summary Metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">
              {result.documentTitle || 'Documento Tradotto con Successo'}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-slate-300">
              Lingua: {result.detectedLanguage || 'Italiano'} &rarr; Inglese
            </span>
            {result.usedModel && (
              <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 font-mono">
                LLM: {result.usedModel}
              </span>
            )}
            {result.metrics?.tableCount !== undefined && (
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
                {result.metrics.tableCount} Tabelle
              </span>
            )}
            {result.metrics?.translatedWordCountEstimate !== undefined && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                ~{result.metrics.translatedWordCountEstimate} Parole
              </span>
            )}
          </div>
        </div>

        {/* Center: View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('paper')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'paper'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Documento Impaginato</span>
          </button>

          <button
            onClick={() => setViewMode('ascii')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'ascii'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>ASCII / Testo</span>
          </button>

          {result.sections && result.sections.length > 0 && (
            <button
              onClick={() => setViewMode('split-diff')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'split-diff'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Confronto Paragrafo</span>
            </button>
          )}
        </div>

        {/* Right: Download Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadWord}
            disabled={downloadingDocx}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
            title="Scarica documento Microsoft Word con tabelle e stili"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{downloadingDocx ? 'Generazione...' : 'Word (.docx)'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all"
            title="Stampa o salva in PDF con impaginazione"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            title="Scarica formato ASCII / Testo"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ASCII .txt</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Copia testo tradotto"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Synchronized Scrolling Toggle */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2 no-print">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={syncScroll}
              onChange={(e) => setSyncScroll(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-300">Scroll sincronizzato affiancato</span>
          </label>
        </div>
        <span className="text-[11px] text-slate-500 italic">
          Scorri in uno dei due pannelli per confrontare la struttura riga per riga
        </span>
      </div>

      {/* Main Dual-Pane Viewer */}
      {viewMode === 'paper' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Original Document */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[750px] shadow-inner no-print">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-xs font-bold text-slate-300">
                  Originale ({originalFile.name})
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                {originalFile.type}
              </span>
            </div>

            <div
              ref={leftPaneRef}
              onScroll={(e) => handleScroll(e, rightPaneRef)}
              className="p-6 overflow-y-auto flex-1 font-sans text-slate-800 bg-slate-100/95 leading-relaxed selection:bg-indigo-200"
            >
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 min-h-full">
                {originalFile.type === 'pdf' ? (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-3 rounded-lg text-xs">
                      📄 <strong>File PDF acquisito</strong>: Analizzato tramite computer vision multimodale di Gemini.
                    </div>
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {originalFile.content.slice(0, 5000)}
                    </pre>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none text-xs sm:text-sm">
                    <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-transparent p-0 border-0">
                      {originalFile.content}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Translated Document (Preserving Layout) */}
          <div
            id="printable-doc-container"
            className="bg-slate-900/40 border border-indigo-500/30 rounded-2xl overflow-hidden flex flex-col h-[750px] shadow-xl shadow-indigo-950/20"
          >
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 px-4 py-2.5 border-b border-indigo-500/30 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Tradotto in Inglese (Layout Identico Preservato)
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                ENGLISH VERSION
              </span>
            </div>

            <div
              ref={rightPaneRef}
              onScroll={(e) => handleScroll(e, leftPaneRef)}
              className="p-6 overflow-y-auto flex-1 font-sans text-slate-900 bg-slate-100 leading-relaxed selection:bg-indigo-200"
            >
              <div
                id="printable-document"
                className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-xl border border-slate-200 min-h-full space-y-4"
              >
                {/* Executive Title */}
                <div className="border-b-2 border-indigo-900 pb-3 mb-6">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {result.documentTitle || 'Translated Document'}
                  </h1>
                  {result.summary && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 italic bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-600">
                      <strong>Executive Summary:</strong> {result.summary}
                    </p>
                  )}
                </div>

                {/* Rendered HTML */}
                <div
                  className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed [&_h1]:text-lg [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-800 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:bg-slate-800 [&_th]:text-white [&_th]:p-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-xs [&_td]:p-2.5 [&_td]:border [&_td]:border-slate-300 [&_td]:text-xs [&_tr:nth-child(even)]:bg-slate-50 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-1 [&_strong]:text-slate-900 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600"
                  dangerouslySetInnerHTML={{ __html: result.translatedHtml }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASCII View */}
      {viewMode === 'ascii' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Original ASCII */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[750px]">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Original ASCII / Raw Text</span>
              <span className="font-mono text-slate-500 text-[11px]">Fonte</span>
            </div>
            <div
              ref={leftPaneRef}
              onScroll={(e) => handleScroll(e, rightPaneRef)}
              className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950/80 whitespace-pre leading-relaxed select-all"
            >
              {originalFile.content}
            </div>
          </div>

          {/* Right: Translated ASCII */}
          <div className="bg-slate-900/60 border border-indigo-500/40 rounded-2xl overflow-hidden flex flex-col h-[750px]">
            <div className="bg-slate-900 px-4 py-2 border-b border-indigo-500/30 flex items-center justify-between text-xs font-bold text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                English ASCII / Preserved Grids
              </span>
              <span className="font-mono text-emerald-400 text-[11px]">Formattato</span>
            </div>
            <div
              ref={rightPaneRef}
              onScroll={(e) => handleScroll(e, leftPaneRef)}
              className="p-4 overflow-y-auto flex-1 font-mono text-xs text-emerald-300 bg-slate-950/80 whitespace-pre leading-relaxed select-all"
            >
              {result.translatedPlainText}
            </div>
          </div>
        </div>
      )}

      {/* Split Diff / Section by Section Comparison */}
      {viewMode === 'split-diff' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100">
              Confronto Dettagliato Sezione per Sezione
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizza la corrispondenza esatta tra le porzioni di testo originali e la resa in lingua inglese.
            </p>
          </div>

          <div className="space-y-3">
            {result.sections?.map((sec, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-800/80 pb-3 md:pb-0 md:pr-4">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Originale {sec.title ? `(${sec.title})` : `[Sez. ${idx + 1}]`}
                  </span>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {sec.originalSnippet}
                  </p>
                </div>

                <div className="space-y-1.5 md:pl-2">
                  <span className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Traduzione Inglese
                  </span>
                  <p className="text-xs text-indigo-100 font-medium whitespace-pre-wrap leading-relaxed">
                    {sec.translatedSnippet}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
