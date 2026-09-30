export type Jurisdiction = 'IN' | 'US' | 'AU' | 'INTERNATIONAL';

export type AuthorityTier = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'TIER_4';

export type VerificationStatus = 'VERIFIED' | 'NOT_VERIFIED' | 'INSUFFICIENT_EVIDENCE';

export type FormulationCategory =
  | 'Classical ASU Drug'
  | 'Patent / Proprietary ASU Medicine'
  | 'Nutraceutical / Food Supplement (FSSAI)'
  | 'Phytopharmaceutical / Novel Herbal Drug'
  | 'US Dietary Supplement (DSHEA)'
  | 'Australian Listed Medicine (TGA)'
  | 'Unclassified / Requires Investigation';

export interface IngredientItem {
  name: string;
  botanical_name?: string;
  part_used?: string;
  percentage_or_ratio?: string;
  origin_state?: string;
  is_classical_ayurvedic: boolean;
}

export interface InnovationInput {
  name: string;
  description: string;
  ingredients: IngredientItem[];
  intended_use: string;
  dosage_form: string;
  manufacturing_details?: string;
  target_market: string;
  jurisdiction: Jurisdiction;
  is_traditional_classical?: boolean;
  classical_text_reference?: string;
}

export interface ClarifyingQuestion {
  question_id: string;
  question_text: string;
  impact_explanation: string;
  options: string[];
}

export interface ClassificationResult {
  innovation_id?: string;
  primary_category: FormulationCategory;
  secondary_categories: FormulationCategory[];
  confidence: number;
  reasoning: string;
  review_required: boolean;
  clarifying_questions: ClarifyingQuestion[];
  applicable_statute: string;
  regulatory_authority: string;
  disclaimer: string;
}

export interface SourceDocument {
  id: string;
  title: string;
  authority: string;
  tier: AuthorityTier;
  jurisdiction: Jurisdiction;
  domain: string;
  document_type: string;
  section_article?: string;
  year_version?: string;
  source_url?: string;
  verification_date?: string;
  is_official: boolean;
  excerpt?: string;
}

export interface SourceRegistryItem {
  source_id: string;
  source_name: string;
  authority: string;
  jurisdiction: string;
  domain: string;
  tier: number;
  document_type?: string;
  source_url?: string;
  official_domain: boolean;
  description?: string;
  active: boolean;
  last_verified_at?: string;
  last_updated_at?: string;
  version?: string;
  effective_date?: string;
}

export interface CitationItem {
  id: string;
  claim_text: string;
  excerpt: string;
  authority_name: string;
  authority_tier: AuthorityTier;
  jurisdiction: Jurisdiction;
  section_ref?: string;
  source_url?: string;
  verification_status: VerificationStatus;
  grounding_score: number;
  disclaimer?: string;
}

export interface IPConsiderations {
  patent_eligibility_status: string;
  sec_3p_analysis: string;
  novelty_inventive_step_context: string;
  prior_art_risk: string;
  recommendations: string[];
  citations: CitationItem[];
}

export interface TKABSContext {
  tk_relevance_summary: string;
  nba_applicability: string;
  form_requirements: string;
  benefit_sharing_obligation: string;
  safe_handling_note: string;
  citations: CitationItem[];
}

export interface RegulatoryPathway {
  target_jurisdiction: Jurisdiction;
  governing_authority: string;
  licensing_category: string;
  statutory_rules: string;
  clinical_data_requirement: string;
  stability_and_safety_standards: string;
  citations: CitationItem[];
}

export interface ScientificEvidenceItem {
  title: string;
  journal_or_publisher: string;
  year: string;
  doi_or_pmid?: string;
  key_findings: string;
  study_type: string;
  tier: AuthorityTier;
}

export interface FullAnalysisResponse {
  id: string;
  innovation_id?: string;
  innovation_name: string;
  jurisdiction: Jurisdiction;
  status: string;
  confidence_score: number;
  expert_review_recommended: boolean;
  review_reasons: string[];
  safe_abstention_flag: boolean;
  abstention_reason?: string;
  summary: string;
  classification: ClassificationResult;
  ip_considerations: IPConsiderations;
  tk_abs_context: TKABSContext;
  regulatory_pathway: RegulatoryPathway;
  scientific_evidence: ScientificEvidenceItem[];
  citations: CitationItem[];
  sources: SourceDocument[];
  created_at: string;
  data_notice: string;
}

export interface EvaluationScenario {
  scenario_id: string;
  scenario_name: string;
  description: string;
  target_jurisdiction: Jurisdiction;
  citation_precision: number;
  groundness_score: number;
  abstention_accuracy: number;
  latency_ms: number;
  status: string;
  expert_alignment: string;
}

export interface BenchmarkDashboard {
  total_evaluations: number;
  overall_citation_precision: number;
  overall_groundness_score: number;
  safe_abstention_accuracy: number;
  zero_hallucination_rate: number;
  scenarios: EvaluationScenario[];
  last_evaluated_at: string;
}
