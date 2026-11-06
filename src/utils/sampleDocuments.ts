import { DocumentFile } from '../types';

export const SAMPLE_DOCUMENTS: DocumentFile[] = [
  {
    name: 'Contratto_Fornitura_Software_2026.docx',
    type: 'docx',
    size: 24500,
    isSample: true,
    content: `# CONTRATTO DI FORNITURA SOFTWARE E SERVIZI CLOUD
**Riferimento:** IT-DEV-2026-884  
**Data di Stipula:** 15 Febbraio 2026  
**Contraenti:** Nexus Systems S.r.l. (Fornitore) e Alpha Retail S.p.A. (Cliente)

---

## 1. PREMESSE E OGGETTO DELL'ACCORDO
1.1 Il Fornitore si impegna a sviluppare, implementare e rilasciare l'infrastruttura di gestione logistica basata su architettura a microservizi.  
1.2 Il Cliente accetta di corrispondere i corrispettivi secondo il piano a stati avanzamento lavori (SAL) pattuito nella Tabella 1.

---

## 2. CRONOPROGRAMMA E CORRISPETTIVI PATTUITI (TABELLA 1)
Di seguito si dettagliano i rilasci intermedi con i relativi importi in Euro:

| Fase Progetto | Deliverable Tecnico | Termine Consegna | Corrispettivo (EUR) |
| :--- | :--- | :--- | :--- |
| **Fase 1** | Analisi Requisiti e Architettura Dati | 30 Marzo 2026 | € 15.000,00 |
| **Fase 2** | Sviluppo Backend API e Core Engine | 15 Maggio 2026 | € 32.500,00 |
| **Fase 3** | Interfaccia Web Grafica e Test di Carico | 30 Giugno 2026 | € 24.000,00 |
| **Fase 4** | Deploy su Cloud, Collaudo Finale e Formazione | 15 Luglio 2026 | € 18.500,00 |

---

## 3. LIVELLI DI SERVIZIO (SLA) E SUPPORTO TECNICO
Il Fornitore garantisce una disponibilità dell'infrastruttura (Uptime) pari al **99,9%** su base mensile solare.
- **Incidenti Bloccanti (Priorità P1):** Presa in carico entro 30 minuti, risoluzione entro 4 ore lavorative.
- **Incidenti Medi (Priorità P2):** Presa in carico entro 2 ore, risoluzione entro 24 ore lavorative.
- **Richieste di Manutenzione Evolutiva:** Pianificate con sprint quindicinali.

---

## 4. CLAUSOLA DI RISERVATEZZA E FORO COMPETENTE
Tutte le informazioni scambiate sono da intendersi strettamente riservate e vincolate a non divulgazione per 5 anni.  
Per qualsiasi controversia derivante dall'interpretazione o esecuzione del presente accordo, sarà competente in via esclusiva il Foro di Milano.

**Firme delle Parti:**
___________________________                    ___________________________
Nexus Systems S.r.l.                           Alpha Retail S.p.A.`,
  },
  {
    name: 'Specifiche_Infrastruttura_ASCII.asc',
    type: 'ascii',
    size: 14200,
    isSample: true,
    content: `+--------------------------------------------------------------------------+
|                  ARCHITETTURA SISTEMI & SPECIFICHE SERVER CLOUD           |
|                       REVISIONE 4.2 - AMBIENTE PRODUZIONE                |
+--------------------------------------------------------------------------+

1. DIAGRAMMA E TOPOLOGIA DI RETE
   +-------------------+      +-------------------+      +-------------------+
   |   LOAD BALANCER   | ---> |  API GATEWAY (V2) | ---> | DATABASE CLUSTER  |
   |   (Edge NGINX)    |      |  (Express/Node)   |      | (PostgreSQL Dev)  |
   +-------------------+      +-------------------+      +-------------------+
             |                          |                          |
             +---- Health Check: OK     +---- Latenza: 14ms        +---- Sync: Replica 3

2. TABELLA DIMENSIONAMENTO NODI COMPUTAZIONALI
+--------------------+----------------+----------------+---------------------+
| Ruolo Nodo         | CPU / vCore    | Memoria RAM    | Storage SSD NVMe    |
+--------------------+----------------+----------------+---------------------+
| Master-Coordinator | 8 vCPU (3.4GHz)| 32 GB ECC      | 500 GB RAID 10      |
| Worker-Node-01     | 16 vCPU (Xeon) | 64 GB ECC      | 1.0 TB NVMe         |
| Worker-Node-02     | 16 vCPU (Xeon) | 64 GB ECC      | 1.0 TB NVMe         |
| Storage-Backup     | 4 vCPU         | 16 GB          | 4.0 TB Coldline     |
+--------------------+----------------+----------------+---------------------+

3. PARAMETRI DI CONFIGURAZIONE DI SISTEMA
   * Protocollo Trasporto: TLS 1.3 con crittografia AES-256-GCM.
   * Politica di Backup: Snapshot incrementale ogni 6 ore, retention 30 giorni.
   * Sistema Operativo: Ubuntu Linux 24.04 LTS (Kernel 6.8 hardened).
   * Porta Monitoraggio Prometheus: 9090 (accesso riservato tramite VPN interna).

4. NOTE OPERATIVE PER GLI AMMINISTRATORI
   ATTENZIONE: Non riavviare i nodi Worker-01 e Worker-02 contemporaneamente.
   Seguire la procedura di draining del traffico prima di ogni manutenzione programmata.`,
  },
  {
    name: 'Relazione_Finanziaria_Q3.pdf',
    type: 'pdf',
    size: 38900,
    isSample: true,
    content: `# RELAZIONE DI GESTIONE TRIMESTRALE (TERZO TRIMESTRE 2025)
**Divisione Corporate & Finance**  
**Autore:** Dott. Marco Valli (Direttore Amministrazione e Finanza)  
**Destinatari:** Consiglio di Amministrazione e Collegio Sindacale

---

## SINTESI E RISULTATI OPERATIVI PRINCIPALI
Nel terzo trimestre del 2025 il Gruppo ha registrato una crescita consolidata dei ricavi pari al **+18,4%** rispetto allo stesso periodo dell'esercizio precedente, trainata dall'espansione dei servizi digitali e dalla riduzione dei costi fissi di gestione.

---

## TABELLA DEI PRINCIPALI INDICATORI ECONOMICI (IN MILIONI DI EURO)

| Voce di Bilancio | Q3 2024 | Q3 2025 | Variazione Assoluta | Variazione % |
| :--- | :--- | :--- | :--- | :--- |
| **Ricavi Totali Consolidati** | € 42,5 M | € 50,3 M | + € 7,8 M | + 18,35% |
| **Margine Operativo Lordo (EBITDA)** | € 11,2 M | € 14,8 M | + € 3,6 M | + 32,14% |
| **Utile Netto di Esercizio** | € 6,4 M | € 8,9 M | + € 2,5 M | + 39,06% |
| **Posizione Finanziaria Netta (PFN)** | - € 8,2 M | - € 3,1 M | + € 5,1 M | Riduzione Debito |

---

## INVESTIMENTI IN RICERCA E SVILUPPO
Durante il trimestre sono stati completati i seguenti investimenti strategici:
1. Integrazione di modelli di intelligenza artificiale generativa per l'automazione dei documenti legali e tecnici.
2. Certificazione di sicurezza ISO/IEC 27001 per il nuovo data center secondario di Francoforte.
3. Assunzione di 14 nuovi ingegneri del software nel polo tecnologico di Bologna.

---

## PREVISIONI PER IL QUARTO TRIMESTRE E CHIUSURA D'ESERCIZIO
Si prevede una conferma della traiettoria positiva con un fatturato annuo stimato superiore a **210 Milioni di Euro**, al netto di eventuali oscillazioni valutarie o incrementi straordinari del costo delle materie prime energetiche.`,
  },
];
