# DocuMorph AI - Traduttore di Documenti con LLM Locale (OpenAI-Compatibile)

Applicazione per tradurre documenti **PDF, Microsoft Word (.docx) e ASCII/TXT** in lingua inglese preservando l'esatta impaginazione, collegandosi a un **endpoint LLM locale compatibile con le API di OpenAI** (es. **Ollama, LM Studio, vLLM, LocalAI, Jan, text-generation-webui**).

---

## 🚀 Caratteristiche Principali
- **Supporto LLM Locale (Nessun dato esce dalla tua macchina)**:
  - Collegamento diretto a **Ollama** (`http://localhost:11434/v1`)
  - Collegamento a **LM Studio** (`http://localhost:1234/v1`)
  - Collegamento a **vLLM / LocalAI / llama.cpp** (`http://localhost:8000/v1` o `http://localhost:8080/v1`)
  - Qualsiasi modello locale: `llama3`, `qwen2.5`, `mistral`, `deepseek-r1`, `phi-4`, ecc.
- **Supporto Formati**:
  - **Microsoft Word (.docx)**: preserva titoli H1/H2/H3, tabelle con bordi e sfondi, elenchi.
  - **PDF (.pdf)**: estrazione testo e tabelle, rigenerazione PDF.
  - **ASCII & Plain Text (.asc, .txt, .md)**: rispetto rigoroso di spazi, tabelle ASCII (`+----+`) e diagrammi.
- **Doppia Modalità**:
  1. **Interfaccia Grafica Web (Streamlit)**: con input per configurare l'URL dell'endpoint, testare la connessione e visualizzare i modelli disponibili.
  2. **CLI da Terminale**: ideale per elaborazioni batch e automazioni.

---

## 🛠️ Come Avviare l'Endpoint LLM Locale

### Con Ollama
```bash
# Scarica e avvia un modello (es. llama3 o mistral)
ollama run llama3

# Nota su CORS se ti colleghi da un browser:
# Linux/macOS:
OLLAMA_ORIGINS="*" ollama serve
# Windows PowerShell:
$env:OLLAMA_ORIGINS="*" ; ollama serve
```
L'endpoint OpenAI-compatibile è attivo su: `http://localhost:11434/v1`

### Con LM Studio
1. Apri LM Studio e scarica un modello (es. Llama-3-8B-Instruct o Mistral-7B).
2. Vai nella scheda **Local Server** (icona `<->`).
3. Clicca su **Start Server**.
L'endpoint è attivo su: `http://localhost:1234/v1`

---

## 💻 Installazione ed Esecuzione dell'App Python

1. **Crea l'ambiente virtuale:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Su Windows: venv\Scripts\activate
   ```

2. **Installa le dipendenze:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Avvia l'Interfaccia Web Grafica:**
   ```bash
   streamlit run web_app.py
   ```
   Dalla barra laterale potrai inserire o modificare l'URL dell'endpoint (`http://localhost:11434/v1` o personalizzato), verificare la connessione con il pulsante dedicato e tradurre i tuoi file!

4. **Oppure usa lo Script da Riga di Comando (CLI):**
   ```bash
   # Traduzione file Word con Ollama locale
   python doc_translator.py contratto.docx -e http://localhost:11434/v1 -m llama3 -o contratto_EN.docx

   # Traduzione file PDF
   python doc_translator.py bilancio.pdf -e http://localhost:11434/v1 -m llama3 -o bilancio_EN.pdf

   # Traduzione file ASCII
   python doc_translator.py specifiche.txt -e http://localhost:11434/v1 -m llama3 -o specifiche_EN.txt
   ```
