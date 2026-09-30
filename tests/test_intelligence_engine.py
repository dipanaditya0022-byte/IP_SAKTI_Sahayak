import pytest
from backend.app.services.intelligence.engine import IntelligenceEngine, CitationVerifier, ContextBuilder, ConfidenceEngine, AbstentionEngine
from backend.app.models.intelligence import Claim, CitationMetadata, VerificationResult, ClaimImportance, ConfidenceScore, ConfidenceLabel
from backend.app.models.schemas import SourceDocumentItem, VerificationStatusEnum, AuthorityTierEnum

def test_supported_factual_claim_verified_citation():
    verifier = CitationVerifier()
    
    doc = SourceDocumentItem(
        id="doc-1",
        title="Test Doc",
        authority="Test Auth",
        tier=AuthorityTierEnum.TIER_1,
        jurisdiction="IN",
        domain="TEST",
        document_type="ACT",
        excerpt="The product is legal."
    )
    
    cit = CitationMetadata(
        source_id="doc-1",
        document_id="doc-1",
        source_title="Test Doc",
        jurisdiction="IN",
        authority="Test Auth",
        tier=AuthorityTierEnum.TIER_1
    )
    
    result = verifier.verify_claim("The product is legal", [cit], [doc], "IN")
    assert result.status == VerificationStatusEnum.VERIFIED

def test_claim_no_supporting_evidence_unsupported():
    verifier = CitationVerifier()
    
    cit = CitationMetadata(
        source_id="doc-2", # doesn't exist in docs
        document_id="doc-2",
        source_title="Missing",
        jurisdiction="IN",
        authority="Auth",
        tier=AuthorityTierEnum.TIER_2
    )
    
    result = verifier.verify_claim("Unknown claim", [cit], [], "IN")
    assert result.status == VerificationStatusEnum.NOT_VERIFIED
    
    # Also test empty citations
    result2 = verifier.verify_claim("Unknown claim", [], [], "IN")
    assert result2.status == VerificationStatusEnum.INSUFFICIENT_EVIDENCE

def test_wrong_jurisdiction_evidence():
    verifier = CitationVerifier()
    
    doc = SourceDocumentItem(
        id="doc-1",
        title="US Doc",
        authority="FDA",
        tier=AuthorityTierEnum.TIER_1,
        jurisdiction="US",
        domain="TEST",
        document_type="ACT",
        excerpt="US stuff"
    )
    
    cit = CitationMetadata(
        source_id="doc-1",
        document_id="doc-1",
        source_title="US Doc",
        jurisdiction="US",
        authority="FDA",
        tier=AuthorityTierEnum.TIER_1
    )
    
    # Verifying a claim for India, but citation is US
    result = verifier.verify_claim("Claim", [cit], [doc], "IN")
    assert result.status == VerificationStatusEnum.NOT_VERIFIED
    assert "Mismatch" in result.reason or "mismatch" in result.reason.lower()

def test_high_risk_legal_certainty_question():
    abstention = AbstentionEngine()
    
    conf = ConfidenceScore(score=0.9, label=ConfidenceLabel.HIGH, reasoning="")
    claims = []
    
    abstained, reason = abstention.determine_abstention(conf, claims, "Can I guarantee this patent will be granted?")
    assert abstained is True
    assert "guarantee" in reason.lower() or "safe abstention" in reason.lower()

def test_insufficient_retrieval_abstention():
    engine = IntelligenceEngine()
    
    resp = engine.generate_answer("Query", "CLASSIFICATION", {}, [], "IN")
    
    assert resp.abstained is True
    assert resp.evidence_status.value == "insufficient"
    assert resp.review_required is True

def test_contextual_follow_up_question():
    # Context builder should include the provided documents
    builder = ContextBuilder()
    doc = SourceDocumentItem(
        id="doc-1",
        title="Test",
        authority="Auth",
        tier=AuthorityTierEnum.TIER_1,
        jurisdiction="IN",
        domain="TEST",
        document_type="DOC",
        excerpt="Stuff"
    )
    ctx = builder.build_context("Why was this classified?", {"product_name": "Prod"}, [doc])
    assert "Prod" in ctx
    assert "Stuff" in ctx
    assert "Test" in ctx
