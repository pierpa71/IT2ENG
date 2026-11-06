"""
DocuMorph AI - Interfaccia Web Grafica Python (Streamlit)
Collegamento ad Endpoint LLM Locale OpenAI-compatibile (Ollama, LM Studio, vLLM)
Avvia con: streamlit run web_app.py
"""

import streamlit as st
import tempfile
import requests
from pathlib import Path
from doc_translator import read_document, translate_with_local_llm, save_document

st.set_page_config(
    page_title="DocuMorph AI - Traduttore Python con LLM Locale",
    page_icon="📑",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }
    .stButton>button {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: white;
        font-weight: 600;
        border-radius: 8px;
        padding: 0.6rem 1.2rem;
        border: none;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-header">📑 DocuMorph AI - Traduttore Documenti con LLM Locale</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Traduci PDF, Word (.docx) e file ASCII/TXT con un endpoint OpenAI-compatibile (Ollama, LM Studio, vLLM) preservando l\'impaginazione.</div>', unsafe_allow_html=True)

with st.sidebar:
    st.header("🔌 Configurazione LLM Locale")

    # Preset selection
    preset = st.selectbox(
        "Seleziona Preset Endpoint",
        ["Ollama (http://localhost:11434/v1)", "LM Studio (http://localhost:1234/v1)", "vLLM / LocalAI (http://localhost:8000/v1)", "Personalizzato"]
    )

    default_url = "http://localhost:11434/v1"
    if "1234" in preset:
        default_url = "http://localhost:1234/v1"
    elif "8000" in preset:
        default_url = "http://localhost:8000/v1"

    endpoint_url = st.text_input("URL Endpoint OpenAI-compatibile:", value=default_url)
    model_name = st.text_input("Nome Modello:", value="llama3")
    api_key = st.text_input("API Key (opzionale):", value="not-needed", type="password")

    # Test connection button
    if st.button("🔍 Testa Connessione Endpoint"):
        try:
            url_clean = endpoint_url.rstrip("/") + "/models"
            resp = requests.get(url_clean, headers={"Authorization": f"Bearer {api_key}"}, timeout=4)
            if resp.status_code == 200:
                models = [m.get("id") for m in resp.json().get("data", [])]
                st.success(f"✅ Connesso con successo! Modelli rilevati: {', '.join(models[:5])}")
            else:
                st.warning(f"Endpoint risponde con status {resp.status_code}")
        except Exception as e:
            st.error(f"❌ Impossibile connettersi all'endpoint: {e}")

    st.markdown("---")
    st.header("⚙️ Opzioni Traduzione")
    dialect = st.selectbox("Dialetto Inglese", ["American English (US)", "British English (UK)"])

uploaded_file = st.file_uploader(
    "Carica un documento (PDF, Word .docx, ASCII o Testo)",
    type=["pdf", "docx", "doc", "txt", "asc", "md"]
)

if uploaded_file is not None:
    temp_dir = tempfile.mkdtemp()
    temp_path = Path(temp_dir) / uploaded_file.name
    with open(temp_path, "wb") as f:
        f.write(uploaded_file.getbuffer())

    try:
        raw_text, doc_type = read_document(str(temp_path))

        col1, col2 = st.columns(2)
        with col1:
            st.markdown("### 📄 Documento Originale")
            st.caption(f"File: **{uploaded_file.name}** | Tipo: **{doc_type.upper()}** | Dimensione: **{uploaded_file.size / 1024:.1f} KB**")
            st.text_area("Anteprima contenuto originale:", raw_text, height=450, disabled=True)

        with col2:
            st.markdown(f"### 🇬🇧 Documento Tradotto con {model_name}")
            if st.button("🚀 Avvia Traduzione & Impaginazione con LLM Locale", use_container_width=True):
                with st.spinner(f"Elaborazione tramite endpoint {endpoint_url} in corso..."):
                    d_code = "UK" if "UK" in dialect else "US"
                    translated = translate_with_local_llm(
                        content=raw_text,
                        doc_type=doc_type,
                        endpoint_url=endpoint_url,
                        model_name=model_name,
                        api_key=api_key,
                        dialect=d_code
                    )

                    st.session_state["translated_text"] = translated
                    st.session_state["doc_type"] = doc_type
                    st.session_state["temp_dir"] = temp_dir
                    st.session_state["stem"] = temp_path.stem
                    st.session_state["suffix"] = temp_path.suffix

            if "translated_text" in st.session_state:
                st.text_area("Risultato tradotto (Layout Preservato):", st.session_state["translated_text"], height=380)

                out_name = f"{st.session_state['stem']}_translated_EN{st.session_state['suffix']}"
                out_file = Path(st.session_state["temp_dir"]) / out_name
                save_document(str(out_file), st.session_state["translated_text"], st.session_state["doc_type"])

                with open(out_file, "rb") as fp:
                    st.download_button(
                        label=f"📥 Scarica Documento Tradotto ({out_name})",
                        data=fp,
                        file_name=out_name,
                        mime="application/octet-stream",
                        use_container_width=True
                    )
    except Exception as e:
        st.error(f"Errore: {e}")
