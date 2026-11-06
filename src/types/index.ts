export type SupportedFileType = 'pdf' | 'docx' | 'ascii' | 'text';

export interface DocumentFile {
  name: string;
  type: SupportedFileType;
  size: number;
  content: string; // Plain text or Data URL (base64)
  isSample?: boolean;
}

export type LLMProvider = 'local-openai' | 'gemini';

export interface TranslationOptions {
  provider: LLMProvider;
  endpointUrl: string; // e.g. "http://localhost:11434/v1" or "http://127.0.0.1:1234/v1"
  modelName: string;   // e.g. "llama3", "mistral", "qwen2.5"
  apiKey?: string;     // optional
  tone: 'professional' | 'technical' | 'academic' | 'legal' | 'conversational';
  dialect: 'US' | 'UK';
  preserveTables: boolean;
  customGlossary: string;
}

export interface SectionItem {
  id?: string;
  title?: string;
  originalSnippet?: string;
  translatedSnippet?: string;
}

export interface TranslationMetrics {
  originalWordCountEstimate?: number;
  translatedWordCountEstimate?: number;
  tableCount?: number;
  headingsCount?: number;
}

export interface TranslationResult {
  detectedLanguage: string;
  documentTitle: string;
  summary: string;
  translatedHtml: string;
  translatedPlainText: string;
  sections?: SectionItem[];
  metrics?: TranslationMetrics;
  usedModel?: string;
  usedEndpoint?: string;
}
