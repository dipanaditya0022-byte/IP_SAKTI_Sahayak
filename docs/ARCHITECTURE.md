# IP-SAKTI Sahayak — System Architecture

## 1. System Mission & Boundary
**IP-SAKTI Sahayak** is an evidence-grounded, jurisdiction-aware intelligence copilot for Ayurveda innovation. It is engineered specifically for Ayurveda researchers, startups, and institutions to synthesize authoritative statutory, patent, biodiversity, and scientific evidence.

### What IP-SAKTI Sahayak IS:
- A multi-tier evidence grounding engine synthesizing Indian and international statutes.
- A jurisdiction-aware router separating India, United States (FDA), and Australia (TGA).
- An anti-hallucination verification workspace with explicit citation verification tags (`VERIFIED`, `NOT_VERIFIED`, `INSUFFICIENT_EVIDENCE`).
- A safe abstention engine that refuses to speculate on unsupported legal outcomes.

### What IP-SAKTI Sahayak IS NOT:
- NOT a generic AI chatbot or medical diagnosis tool.
- NOT a legal advice service or patent filing system.
- NOT a replacement for statutory authorities (Indian Patent Office, CDSCO, NBA, US FDA, TGA).
- DOES NOT claim unauthorized or simulated access to TKDL (Traditional Knowledge Digital Library).

---

## 2. Architectural Diagram

```mermaid
flowchart TD
    subgraph Client ["Frontend: Next.js 15 + Tailwind + TypeScript"]
        UI[Intelligence & Research Workspace]
        Profiler[Innovation Intake Profiler]
        Lang[Bilingual Toggle: EN / HI]
        Bench[SIH Benchmark & Evaluation Dashboard]
    end

    subgraph API ["Backend API: FastAPI (Python 3.13)"]
        Router[API Gateway & Router]
        ClassifyEP["/api/classify"]
        AnalyzeEP["/api/analyze"]
        RetrieveEP["/api/retrieve"]
        VerifyEP["/api/verify-citations"]
        SourcesEP["/api/sources"]
        EvalEP["/api/evaluations"]
    end

    subgraph HybridEngine ["Retrieval & Evidence Grounding Engine"]
        Dense[Dense Vector Retrieval: BGE-M3]
        Sparse[Sparse Keyword Search: PostgreSQL tsvector]
        RRF[Reciprocal Rank Fusion & Reranking]
        CitationVerifier[Statutory Grounding & Anti-Hallucination Guard]
        AbstentionProtocol[Safe Abstention & Human Escalation Trigger]
    end

    subgraph Storage ["Database: Supabase PostgreSQL + pgvector"]
        DocTable[(documents)]
        ChunkTable[(document_chunks + vector1024)]
        InnoTable[(innovations)]
        AnalysisTable[(analyses)]
        CitationTable[(citations)]
        ClassTable[(classification_results)]
        EvalTable[(evaluation_results)]
    end

    Profiler --> Router
    UI --> Router
    Bench --> Router
    Router --> ClassifyEP & AnalyzeEP & RetrieveEP & VerifyEP & SourcesEP & EvalEP
    AnalyzeEP --> HybridEngine
    HybridEngine --> Dense & Sparse
    Dense & Sparse --> RRF
    RRF --> CitationVerifier
    CitationVerifier --> AbstentionProtocol
    HybridEngine --> Storage
```

---

## 3. End-to-End Decision Flow
```
Understand (Intake Profiler)
   ↓
Classify (Classical ASU vs Patent & Proprietary vs FSSAI Nutraceutical)
   ↓
Route (India AYUSH / US FDA DSHEA / Australia TGA)
   ↓
Retrieve (Hybrid Dense BGE-M3 + Sparse Keyword PostgreSQL)
   ↓
Verify (Grounding Score & Authority Tier Matching)
   ↓
Explain (Synthesized Multi-Domain Intelligence Dossier)
   ↓
Act / Escalate (Actionable Recommendations or Human Expert Escalation Flag)
```
