# IP-SAKTI Sahayak (आईपी-शक्ति सहायक)
> **Evidence-Grounded, Jurisdiction-Aware Intelligence Copilot for Ayurveda Innovation**  
> *Smart India Hackathon (SIH) MVP*

---

## 🌟 Executive Summary & Mission
**IP-SAKTI Sahayak** is designed for Ayurveda researchers, startups, and institutions to synthesize fragmented information across **Intellectual Property (Patents Act Section 3(p))**, **Traditional Knowledge**, **Access & Benefit Sharing (Biological Diversity Act 2002)**, **Regulatory Pathways (AYUSH Rule 158B, CDSCO, US FDA DSHEA, Australia TGA)**, and **Scientific Evidence**.

### Core Tenet: Strict Grounding & Safe Abstention
- **Zero Hallucination Tolerance**: Every legal, patent, and regulatory conclusion is explicitly grounded in an authoritative source.
- **Safe Abstention Protocol**: When authoritative evidence is insufficient or when asked for speculative guarantees, the system safely abstains: *"I don't have sufficient authoritative evidence to answer this reliably."*
- **Jurisdiction Safety**: Separate and distinct treatment for India (AYUSH/CDSCO/NBA), United States (FDA), and Australia (TGA).
- **Clear Product Boundary**: Provides research intelligence and decision support; does NOT replace government authorities or qualified legal counsel.

---

## 🏛️ Project Architecture

```
/
├── frontend/               # Next.js 15, TypeScript, Tailwind CSS, Lucide Icons
│   ├── app/                # App Router (page, layout, globals.css)
│   ├── components/         # Header, HeroSection, NewAnalysisForm, AnalysisResults,
│   │                       # SourceCorpusExplorer, BenchmarkDashboard
│   ├── lib/                # API client with fallback & i18n bilingual dictionaries
│   └── types/              # Domain TypeScript interfaces
│
├── backend/                # FastAPI, Python 3.13, Pydantic, Uvicorn
│   ├── app/
│   │   ├── api/endpoints/  # innovations, classify, analyze, retrieve, verify, sources, evaluations
│   │   ├── core/           # Configuration & Settings (Pydantic BaseSettings)
│   │   ├── models/         # Pydantic domain models & schemas
│   │   └── services/       # Curated demo scenarios & mock data
│   ├── db/
│   │   └── schema.sql      # PostgreSQL + pgvector schema & GIN indexes
│   └── requirements.txt    # FastAPI, uvicorn, pydantic, httpx, pytest
│
├── rag/                    # Retrieval-Augmented Generation Architecture
│   ├── embeddings/         # BAAI/bge-m3 dense vector stub
│   ├── retriever/          # Hybrid retriever (Dense + Sparse FTS) stub
│   └── reranker/           # Cross-encoder reranking stub
│
├── ingestion/              # Document parser & OCR fallbacks
├── tests/                  # Integration test suite (Pytest)
├── docs/                   # System Architecture, Source Hierarchy & API specs
├── data/                   # Seed corpus data files
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore rules
└── README.md
```

---

## 🧪 Official SIH Demo Scenarios

The MVP comes pre-configured with 3 official demo scenarios accessible directly from the hero interface:

1. **Scenario A: Formulation Classification (India)**
   - *Case*: Novel Nano-Curcumin + Piperine Effervescent Tablet.
   - *Outcome*: Classifies formulation as Ayurvedic **Patent or Proprietary (P&P) Medicine** under Section 3(h) of Drugs & Cosmetics Act 1940 and Rule 158B rather than Classical ASU or standalone FSSAI nutraceutical. Generates precision clarifying questions.

2. **Scenario B: India IP & Biodiversity / ABS Compliance**
   - *Case*: Standardized Triphala Extract processed via enzymatic biocatalysis.
   - *Outcome*: Highlights statutory **Section 3(p)** Traditional Knowledge patent bar under Indian Patents Act 1970; provides claim structuring recommendations to claim the novel catalytic process; identifies mandatory **Form I** approval requirement under Section 6 of Biological Diversity Act 2002.

3. **Scenario C: Cross-Border International Routing & Safe Abstention**
   - *Case*: Standardized Ashwagandha matrix targeted for export to US (FDA DSHEA) and Australia (TGA Listed Medicine).
   - *Outcome*: Provides jurisdiction-separated pathways (US 21 CFR 101.93 vs TGA Section 26A) and triggers **Safe Abstention Protocol** when prompted for definitive non-infringement or customs clearance guarantees.

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: v20+ (Node v24 tested)
- **Python**: 3.11+ (Python 3.13 tested)

### 2. Backend Setup
```bash
# Navigate to repository root
cd "d:/SIH 27.09"

# Create and activate Python virtual environment
python -m venv .venv
.\.venv\Scripts\activate  # On Windows PowerShell

# Install dependencies
pip install -r backend/requirements.txt

# Run backend test suite
pytest -v tests/

# Start FastAPI server
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend Swagger API Docs will be available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
# Open a new terminal
cd "d:/SIH 27.09/frontend"

# Install dependencies
npm install

# Run build verification
npm run build

# Start frontend development server
npm run dev
```
Frontend web application will be accessible at: `http://localhost:3000`

---

## 📊 Database Schema (PostgreSQL + pgvector)

The database schema (`backend/db/schema.sql`) implements:
- `documents`: Authoritative documents with Tier (1-4), Jurisdiction (IN, US, AU), and Domain.
- `document_chunks`: Chunks with `vector(1024)` embeddings and `tsvector` generated full-text columns with GIN index.
- `innovations`: Innovation profile intake and botanical specifications.
- `analyses`: Comprehensive multi-domain intelligence synthesis records.
- `citations`: Verified claim-to-source citation anchors with grounding scores.
- `classification_results`: Regulatory classification decisions with confidence and review flags.
- `evaluation_questions` & `evaluation_results`: Continuous anti-hallucination benchmark test suite.

---

## 🔒 Security & Safe Handling Notice
- TKDL integration requires authorized government credentials; no simulated or unauthorized access is claimed.
- No API keys or secrets are committed. All configurations are loaded via environment variables (`.env.example`).
- All mock and demo records are explicitly labeled: *"Demo data — replace with verified source corpus."*
