from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class JurisdictionEnum(str, Enum):
    IN = "IN"
    US = "US"
    AU = "AU"
    INTERNATIONAL = "INTERNATIONAL"

class AuthorityTierEnum(str, Enum):
    TIER_1 = "TIER_1"
    TIER_2 = "TIER_2"
    TIER_3 = "TIER_3"
    TIER_4 = "TIER_4"

class VerificationStatusEnum(str, Enum):
    VERIFIED = "VERIFIED"
    NOT_VERIFIED = "NOT_VERIFIED"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"

class FormulationCategoryEnum(str, Enum):
    CLASSICAL = "Classical ASU Drug"
    PATENT = "Patent / Proprietary ASU Medicine"
    NUTRACEUTICAL = "Nutraceutical / Food Supplement (FSSAI)"
    PHYTOPHARMACEUTICAL = "Phytopharmaceutical / Novel Herbal Drug"
    US_DSHEA = "US Dietary Supplement (DSHEA)"
    AU_TGA = "Australian Listed Medicine (TGA)"
    UNCLASSIFIED = "Unclassified / Requires Investigation"

class IngredientItem(BaseModel):
    name: str
    botanical_name: Optional[str] = None
    part_used: Optional[str] = None
    percentage_or_ratio: Optional[str] = None
    origin_state: Optional[str] = None
    is_classical_ayurvedic: bool = False

class InnovationInput(BaseModel):
    name: str = "Unnamed Innovation"
    description: str
    ingredients: List[str] = []
    intended_use: str = ""
    dosage_form: str = ""
    manufacturing_details: Optional[str] = None
    target_market: str = "INDIA"
    jurisdiction: Optional[JurisdictionEnum] = None
    is_traditional_classical: Optional[bool] = None
    classical_text_reference: Optional[str] = None

class ClarifyingQuestion(BaseModel):
    question_id: str
    question_text: str
    impact_explanation: str
    options: List[str]

class ClassificationResult(BaseModel):
    innovation_id: Optional[str] = None
    primary_category: str
    secondary_categories: List[str] = []
    confidence: float
    reasoning: str
    review_required: bool
    clarifying_questions: List[ClarifyingQuestion] = []
    applicable_statute: str
    regulatory_authority: str
    disclaimer: str

class SourceDocumentItem(BaseModel):
    id: str
    title: str
    authority: str
    tier: AuthorityTierEnum
    jurisdiction: JurisdictionEnum
    domain: str
    document_type: str
    section_article: Optional[str] = None
    year_version: Optional[str] = None
    source_url: Optional[str] = None
    verification_date: Optional[str] = None
    is_official: bool
    excerpt: Optional[str] = None

class CitationItem(BaseModel):
    id: str
    claim_text: str
    excerpt: str
    authority_name: str
    authority_tier: AuthorityTierEnum
    jurisdiction: JurisdictionEnum
    section_ref: Optional[str] = None
    source_url: Optional[str] = None
    verification_status: VerificationStatusEnum
    grounding_score: float
    disclaimer: Optional[str] = None

class IPConsiderations(BaseModel):
    patent_eligibility_status: str
    sec_3p_analysis: str
    novelty_inventive_step_context: str
    prior_art_risk: str
    recommendations: List[str]
    citations: List[CitationItem]

class TKABSContext(BaseModel):
    tk_relevance_summary: str
    nba_applicability: str
    form_requirements: str
    benefit_sharing_obligation: str
    safe_handling_note: str
    citations: List[CitationItem]

class RegulatoryPathway(BaseModel):
    target_jurisdiction: JurisdictionEnum
    governing_authority: str
    licensing_category: str
    statutory_rules: str
    clinical_data_requirement: str
    stability_and_safety_standards: str
    citations: List[CitationItem]

class ScientificEvidenceItem(BaseModel):
    title: str
    journal_or_publisher: str
    year: str
    doi_or_pmid: Optional[str] = None
    key_findings: str
    study_type: str
    tier: AuthorityTierEnum

class FullAnalysisResponse(BaseModel):
    id: str
    innovation_id: Optional[str] = None
    innovation_name: str
    jurisdiction: JurisdictionEnum
    status: str
    confidence_score: float
    expert_review_recommended: bool
    review_reasons: List[str] = []
    safe_abstention_flag: bool = False
    abstention_reason: Optional[str] = None
    summary: str
    classification: ClassificationResult
    ip_considerations: IPConsiderations
    tk_abs_context: TKABSContext
    regulatory_pathway: RegulatoryPathway
    scientific_evidence: List[ScientificEvidenceItem] = []
    citations: List[CitationItem] = []
    sources: List[SourceDocumentItem] = []
    created_at: str
    data_notice: str

class AnalysisRequest(BaseModel):
    product_name: Optional[str] = "Unnamed Innovation"
    description: str
    ingredients: Optional[List[str]] = []
    intended_use: Optional[str] = ""
    dosage_form: Optional[str] = ""
    target_market: str = "INDIA"
