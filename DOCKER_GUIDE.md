# Guida all'installazione ed esecuzione con Docker

DocuMorph AI include configurazioni complete per essere eseguito in **Docker** e **Docker Compose**, permettendo un avvio isolato, riproducibile e senza dover installare Node.js o Python sul proprio computer.

---

## ⚡ Avvio Rapido con Docker Compose (Consigliato)

1. **Clona o scarica la cartella del progetto sul tuo PC.**

2. **Avvia l'applicazione con un solo comando:**
   ```bash
   docker compose up --build -d
   ```

3. **Apri il browser:**
   - Vai all'indirizzo: **`http://localhost:3000`**

L'applicazione si avvierà in modalità produzione con Node.js, Express e il frontend React compilato.

---

## 🔌 Come Collegare il Container all'LLM Locale (Ollama o LM Studio)

> ⚠️ **Regola Fondamentale del Networking Docker:**  
> All'interno di un container Docker, l'indirizzo `localhost` fa riferimento al container stesso, **non** al tuo computer host!

Per raggiungere il server Ollama o LM Studio in esecuzione sul tuo PC:
1. Abbiamo già inserito nel file `docker-compose.yml` la direttiva:
   ```yaml
   extra_hosts:
     - "host.docker.internal:host-gateway"
   ```
2. Nell'interfaccia web di DocuMorph AI, inserisci nel campo **URL Endpoint**:
   - Per **Ollama**: `http://host.docker.internal:11434/v1`
   - Per **LM Studio**: `http://host.docker.internal:1234/v1`
   - Per **vLLM / LocalAI**: `http://host.docker.internal:8000/v1`

3. Se usi Ollama, ricordati di avviarlo consentendo le richieste esterne (CORS):
   - Su Linux/macOS:
     ```bash
     OLLAMA_ORIGINS="*" OLLAMA_HOST="0.0.0.0" ollama serve
     ```
   - Su Windows (PowerShell):
     ```powershell
     $env:OLLAMA_ORIGINS="*" ; $env:OLLAMA_HOST="0.0.0.0" ; ollama serve
     ```

---

## 🐳 Avvio con Docker Standalone (Senza Compose)

Se preferisci usare direttamente il comando `docker build` e `docker run`:

```bash
# 1. Compila l'immagine Docker
docker build -t documorph-ai .

# 2. Esegui il container esponendo la porta 3000 e abilitando l'host gateway
docker run -d \
  --name documorph-ai \
  -p 3000:3000 \
  --add-host=host.docker.internal:host-gateway \
  documorph-ai
```

---

## 🐍 Esecuzione dell'Interfaccia Python Streamlit in Docker

Se vuoi eseguire specificamente l'interfaccia grafica scritta in **Python Streamlit**:

```bash
# Con Docker Compose:
docker compose --profile python up --build -d

# Oppure con Docker Standalone:
docker build -f Dockerfile.python -t documorph-python .
docker run -d -p 8501:8501 --add-host=host.docker.internal:host-gateway documorph-python
```
L'interfaccia Streamlit sarà raggiungibile su **`http://localhost:8501`**.

---

## 🛑 Arresto dei Container

```bash
docker compose down
```
