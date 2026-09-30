# IP-SAKTI Sahayak — Backend API Specification

Base URL: `http://localhost:8000/api`

## Endpoints

### 1. Innovation Intake
- **`POST /api/innovations`**: Registers a new Ayurvedic innovation profile.
- **`GET /api/innovations`**: Lists all registered innovations.
- **`GET /api/innovations/{id}`**: Retrieves a specific innovation dossier.

### 2. Product Classification
- **`POST /api/classify`**: Classifies an Ayurvedic innovation into Classical ASU, Patent & Proprietary, FSSAI Nutraceutical, or Phytopharmaceutical.
  - Returns: Primary Category, Secondary Categories, Confidence, Statutory Basis, Clarifying Questions, Human Review Flags.

### 3. End-to-End Grounded Analysis
- **`POST /api/analyze`**: Executes multi-domain intelligence synthesis across:
  - Product Classification
  - IP Considerations (Section 3(p) Traditional Knowledge bar)
  - Traditional Knowledge & Biodiversity / ABS (NBA Section 3 & 6 compliance, Form I)
  - Regulatory Pathways (AYUSH Rule 158B / US FDA DSHEA / AU TGA)
  - Scientific Evidence (PubMed clinical trials)
  - Authoritative Sources & Citations
  - Safe Abstention Protocol Trigger & Expert Escalation

### 4. Hybrid Retrieval
- **`POST /api/retrieve`**: Queries the pgvector + full-text search corpus with reciprocal rank fusion (RRF) and Tier/Jurisdiction filtering.

### 5. Citation Verification & Anti-Hallucination
- **`POST /api/verify-citations`**: Verifies whether a specific claim assertion is grounded in official Tier 1/2 texts.
  - Status values: `VERIFIED`, `NOT_VERIFIED`, `INSUFFICIENT_EVIDENCE`.

### 6. Curated Sources Explorer
- **`GET /api/sources`**: Returns documents in the curated knowledge corpus.

### 7. SIH Evaluation & Benchmark Dashboard
- **`GET /api/evaluations`**: Returns live benchmark evaluation metrics across Citation Precision, Groundness Score, Safe Abstention Accuracy, and Zero Hallucination Rate.
