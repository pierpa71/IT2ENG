import React, { useRef } from 'react';
import { UploadCloud, FileText, FileCode, CheckCircle2, Sparkles, X, AlertCircle } from 'lucide-react';
import { DocumentFile, SupportedFileType } from '../types';
import { SAMPLE_DOCUMENTS } from '../utils/sampleDocuments';

interface UploadDropzoneProps {
  currentFile: DocumentFile | null;
  onSelectFile: (file: DocumentFile | null) => void;
  isLoading: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  currentFile,
  onSelectFile,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase();

    let fileType: SupportedFileType = 'text';
    if (extension === 'pdf') {
      fileType = 'pdf';
    } else if (extension === 'docx' || extension === 'doc') {
      fileType = 'docx';
    } else if (extension === 'asc' || extension === 'ascii') {
      fileType = 'ascii';
    } else {
      fileType = 'text';
    }

    if (fileType === 'pdf') {
      // Read PDF as base64 Data URL for Gemini Multimodal PDF processing
      const reader = new FileReader();
      reader.onload = () => {
        onSelectFile({
          name: fileName,
          type: 'pdf',
          size: file.size,
          content: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Read text / ascii / docx as text
      const reader = new FileReader();
      reader.onload = () => {
        onSelectFile({
          name: fileName,
          type: fileType,
          size: file.size,
          content: (reader.result as string) || '',
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      {!currentFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500/80 bg-slate-900/40 hover:bg-slate-900/70 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all group relative overflow-hidden"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.asc,.ascii,.md,.rtf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="absolute inset-0 bg-radial from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-200 transition-colors">
            Trascina qui il tuo documento o <span className="text-indigo-400 underline decoration-indigo-500/40 underline-offset-4">sfoglia i file</span>
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto">
            Supporta formati <strong className="text-slate-300">PDF (.pdf)</strong>, <strong className="text-slate-300">Word (.docx)</strong> e <strong className="text-slate-300">ASCII / Testo (.asc, .txt, .md)</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono">
              PDF Document
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono">
              Microsoft Word DOCX
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono">
              ASCII Fixed-Width
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg shadow-indigo-950/20">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
              {currentFile.type === 'pdf' ? (
                <FileText className="w-6 h-6 text-rose-400" />
              ) : currentFile.type === 'docx' ? (
                <FileText className="w-6 h-6 text-blue-400" />
              ) : (
                <FileCode className="w-6 h-6 text-emerald-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-sm truncate">
                  {currentFile.name}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                  {currentFile.type.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {(currentFile.size / 1024).toFixed(1)} KB &bull; Pronto per la traduzione e ricostruzione layout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectFile(null)}
              disabled={isLoading}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors disabled:opacity-50"
              title="Rimuovi file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Sample Selector */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Oppure prova subito con un documento di esempio:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.name}
              disabled={isLoading}
              onClick={() => onSelectFile(sample)}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                currentFile?.name === sample.name
                  ? 'bg-indigo-600/15 border-indigo-500/60 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {sample.type === 'docx' && <FileText className="w-4 h-4 text-blue-400" />}
                {sample.type === 'ascii' && <FileCode className="w-4 h-4 text-emerald-400" />}
                {sample.type === 'pdf' && <FileText className="w-4 h-4 text-rose-400" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {sample.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {sample.type === 'docx' && 'Contratto SLA con Tabella SAL'}
                  {sample.type === 'ascii' && 'Specifiche con Tabelle ASCII'}
                  {sample.type === 'pdf' && 'Bilancio Finanziario Q3'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
