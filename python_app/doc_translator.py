"""
DocuMorph AI - Traduttore Documenti in Python (PDF, Word DOCX, ASCII/TXT)
Supporto per Endpoint Locale compatibile OpenAI (Ollama, LM Studio, vLLM, LocalAI) e Gemini Cloud
"""

import os
import sys
import json
import argparse
from pathlib import Path
from openai import OpenAI

def read_document(file_path: str):
    """Legge il documento in base all'estensione (.pdf, .docx, .txt, .asc)"""
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File non trovato: {file_path}")

    suffix = path.suffix.lower()

    if suffix == ".pdf":
        import pypdf
        reader = pypdf.PdfReader(file_path)
        text_pages = []
        for i, page in enumerate(reader.pages):
            text_pages.append(f"--- [PAGINA {i+1}] ---\\n" + (page.extract_text() or ""))
        return "\\n".join(text_pages), "pdf"

    elif suffix in [".docx", ".doc"]:
        import docx
        doc = docx.Document(file_path)
        paragraphs = []
        for p in doc.paragraphs:
            if p.text.strip():
                prefix = f"### {p.text}" if p.style.name.startswith("Heading") else p.text
                paragraphs.append(prefix)
        for t_idx, table in enumerate(doc.tables):
            paragraphs.append(f"\\n--- TABELLA {t_idx+1} ---")
            for row in table.rows:
                row_str = " | ".join([cell.text.strip() for cell in row.cells])
                paragraphs.append(f"| {row_str} |")
        return "\\n".join(paragraphs), "docx"

    else:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            return f.read(), "ascii"

def translate_with_local_llm(
    content: str,
    doc_type: str,
    endpoint_url: str = "http://localhost:11434/v1",
    model_name: str = "llama3",
    api_key: str = "not-needed",
    dialect: str = "US"
):
    """
    Invia la richiesta di traduzione a un endpoint compatibile OpenAI locale
    (es. Ollama http://localhost:11434/v1, LM Studio http://localhost:1234/v1, vLLM http://localhost:8000/v1)
    """
    client = OpenAI(
        base_url=endpoint_url.rstrip("/"),
        api_key=api_key or "not-needed"
    )

    system_instruction = f"""You are a professional document translation and layout-preservation specialist.
Translate the input document into English ({dialect} English).

CRITICAL FORMATTING & LAYOUT RULES:
1. Retain exact heading hierarchy (# Heading 1, ## Heading 2, ### Heading 3).
2. Retain all tables identically, matching rows, columns, headers, and alignments using markdown table syntax (| col | col |).
3. Retain exact bullet lists (- or *), numbered lists (1. 2.), and indentation.
4. If ASCII diagram or borders are present, preserve the fixed-width border scheme (+---+ and |).
5. Output ONLY the translated document with its exact layout preserved. Do not add introductory chit-chat.
"""

    prompt = f"Original Document ({doc_type}):\\n\\n{content}\\n\\nTranslate to {dialect} English preserving exact layout:"

    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content

def save_document(output_path: str, translated_text: str, doc_type: str):
    """Salva il documento tradotto nel formato richiesto"""
    path = Path(output_path)
    suffix = path.suffix.lower()

    if suffix == ".docx":
        import docx
        doc = docx.Document()
        for line in translated_text.split("\\n"):
            if line.startswith("### "):
                doc.add_heading(line[4:], level=3)
            elif line.startswith("## "):
                doc.add_heading(line[3:], level=2)
            elif line.startswith("# "):
                doc.add_heading(line[2:], level=1)
            elif line.startswith("|") and line.endswith("|"):
                doc.add_paragraph(line)
            else:
                doc.add_paragraph(line)
        doc.save(output_path)
        print(f"Salvataggio Word completato: {output_path}")

    elif suffix == ".pdf":
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        c = canvas.Canvas(output_path, pagesize=letter)
        y = 750
        c.setFont("Helvetica", 10)
        for line in translated_text.split("\\n"):
            if y < 50:
                c.showPage()
                y = 750
                c.setFont("Helvetica", 10)
            c.drawString(50, y, line[:95])
            y -= 14
        c.save()
        print(f"Salvataggio PDF completato: {output_path}")

    else:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(translated_text)
        print(f"Salvataggio ASCII / Testo completato: {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Traduci documenti PDF, Word DOCX e ASCII in inglese con LLM locale OpenAI-compatibile.")
    parser.add_argument("input_file", help="Percorso del file di input (.pdf, .docx, .txt, .asc)")
    parser.add_argument("-o", "--output", help="Percorso del file di output (opzionale)")
    parser.add_argument("-e", "--endpoint", default=os.getenv("LOCAL_LLM_URL", "http://localhost:11434/v1"), help="URL Endpoint OpenAI-compatibile locale (default: http://localhost:11434/v1)")
    parser.add_argument("-m", "--model", default="llama3", help="Nome modello LLM locale (es: llama3, mistral, qwen2.5)")
    parser.add_argument("-k", "--api-key", default="not-needed", help="Chiave API per l'endpoint (opzionale, default: not-needed)")
    parser.add_argument("--dialect", choices=["US", "UK"], default="US", help="Dialetto inglese (default: US)")
    args = parser.parse_args()

    input_p = Path(args.input_file)
    output_p = args.output or f"{input_p.stem}_translated_EN{input_p.suffix}"

    print(f"Lettura documento: {input_p} ...")
    content, doc_type = read_document(str(input_p))

    print(f"Collegamento a LLM locale su {args.endpoint} (Modello: {args.model})...")
    translated = translate_with_local_llm(
        content=content,
        doc_type=doc_type,
        endpoint_url=args.endpoint,
        model_name=args.model,
        api_key=args.api_key,
        dialect=args.dialect
    )

    save_document(output_p, translated, doc_type)
    print(f"Successo! Documento tradotto e impaginato salvato in: {output_p}")

if __name__ == "__main__":
    main()
