/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { UploadDropzone } from './components/UploadDropzone';
import { TranslationSettings } from './components/TranslationSettings';
import { DocumentComparisonViewer } from './components/DocumentComparisonViewer';
import { PythonCodeModalOrTab } from './components/PythonCodeModalOrTab';
import { DocsModalOrTab } from './components/DocsModalOrTab';
import { DockerGuideTab } from './components/DockerGuideTab';
import { ProgressIndicator } from './components/ProgressIndicator';
import { DocumentFile, TranslationOptions, TranslationResult } from './types';
import { SAMPLE_DOCUMENTS } from './utils/sampleDocuments';
import { AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'translator' | 'python-code' | 'docs' | 'docker'>('translator');

  // Initialize with Sample 1 (Contratto Fornitura DOCX) so the user immediately sees a ready document
  const [currentFile, setCurrentFile] = useState<DocumentFile | null>(SAMPLE_DOCUMENTS[0]);
  const [options, setOptions] = useState<TranslationOptions>({
    provider: 'local-openai',
    endpointUrl: 'http://localhost:11434/v1',
    modelName: 'llama3',
    apiKey: '',
    tone: 'professional',
    dialect: 'US',
    preserveTables: true,
    customGlossary: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!currentFile) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/translate-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: currentFile.name,
          fileType: currentFile.type,
          content: currentFile.content,
          provider: options.provider,
          endpointUrl: options.endpointUrl,
          modelName: options.modelName,
          apiKey: options.apiKey,
          tone: options.tone,
          dialect: options.dialect,
          preserveTables: options.preserveTables,
          customGlossary: options.customGlossary,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Errore durante la traduzione del documento.');
      }

      setResult(data.data);

      // Trigger celebratory confetti on completion
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err.message || 'Si è verificato un errore durante la traduzione.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Tab 1: Interactive Web Translator */}
        {activeTab === 'translator' && (
          <div className="space-y-6">
            {/* Top Introductory Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xl no-print">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Preservazione Layout Nativo: PDF &bull; Word (.docx) &bull; ASCII</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Traduci documenti in inglese conservando identica l'impaginazione
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Carica un documento o prova subito uno degli esempi. L'intelligenza artificiale estrae tabelle, stili, intestazioni e cornici ASCII, riscrivendoli in lingua inglese senza alterare margini e struttura.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-950/60 border border-rose-500/40 rounded-2xl p-4 flex items-start gap-3 text-rose-200 text-xs no-print">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="block text-rose-100 font-semibold mb-0.5">
                    Attenzione durante l'elaborazione
                  </strong>
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-rose-400 hover:text-rose-200 text-xs underline shrink-0"
                >
                  Chiudi
                </button>
              </div>
            )}

            {/* If no result yet, show Dropzone & Translation Settings */}
            {!result && (
              <div className="space-y-6 no-print">
                <UploadDropzone
                  currentFile={currentFile}
                  onSelectFile={(file) => {
                    setCurrentFile(file);
                    setResult(null);
                    setError(null);
                  }}
                  isLoading={isLoading}
                />

                {currentFile && (
                  <TranslationSettings
                    options={options}
                    setOptions={setOptions}
                    onTranslate={handleTranslate}
                    isLoading={isLoading}
                    canTranslate={Boolean(currentFile && currentFile.content)}
                  />
                )}
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && <ProgressIndicator />}

            {/* Translated Comparison Viewer */}
            {result && currentFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between no-print">
                  <span className="text-xs text-slate-400">
                    Visualizzazione affiancata del documento originale e tradotto
                  </span>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Traduci un altro documento</span>
                  </button>
                </div>

                <DocumentComparisonViewer
                  originalFile={currentFile}
                  result={result}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Python Code & Architecture */}
        {activeTab === 'python-code' && <PythonCodeModalOrTab />}

        {/* Tab 3: Docker & Deployment Guide */}
        {activeTab === 'docker' && <DockerGuideTab />}

        {/* Tab 4: Documentation & Layout Preservation Guide */}
        {activeTab === 'docs' && <DocsModalOrTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">DocuMorph AI</span>
            <span>&bull;</span>
            <span>Motore di traduzione con preservazione layout per PDF, Word & ASCII</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('docker')}
              className="hover:text-blue-400 transition-colors"
            >
              Guida Docker
            </button>
            <button
              onClick={() => setActiveTab('python-code')}
              className="hover:text-emerald-400 transition-colors"
            >
              Script Python Standalone
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className="hover:text-indigo-400 transition-colors"
            >
              Specifiche di Layout
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
