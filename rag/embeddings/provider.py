"""
Embedding Provider Abstraction — IP-SAKTI Sahayak Step 2.

Provides a clean interface for generating embeddings with multiple backends:
  - MockEmbeddingProvider: Deterministic fake 1024-dim vectors (for tests, local dev)
  - LocalBGEM3Provider: Real BAAI/bge-m3 via sentence-transformers (requires GPU/CPU)
  - OpenAIEmbeddingProvider: text-embedding-3-small via OpenAI API

Factory: get_embedding_provider() reads EMBEDDING_PROVIDER env var.
"""

import hashlib
import logging
import os
from abc import ABC, abstractmethod
from typing import List

import numpy as np

logger = logging.getLogger(__name__)

EMBEDDING_DIM = 1024  # BGE-M3 dense vector dimension


# ---------------------------------------------------------------------------
# Abstract Base
# ---------------------------------------------------------------------------

class EmbeddingProvider(ABC):
    """Abstract base class for all embedding providers."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Human-readable provider name."""

    @property
    def dimension(self) -> int:
        return EMBEDDING_DIM

    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        """Embed a single text string. Returns a list of floats."""

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of texts. Default: sequential calls to embed_text."""
        return [self.embed_text(t) for t in texts]


# ---------------------------------------------------------------------------
# Mock Provider (deterministic, no model needed)
# ---------------------------------------------------------------------------

class MockEmbeddingProvider(EmbeddingProvider):
    """
    Deterministic fake embedding provider for local dev and testing.

    Uses SHA-256 hash of text to seed a NumPy RNG, producing a stable
    unit-normalised 1024-dim vector. Same text always gives same vector.
    Cosine similarity between different texts ≈ random but consistent.
    """

    @property
    def name(self) -> str:
        return "mock"

    def embed_text(self, text: str) -> List[float]:
        # Deterministic seed from SHA-256
        digest = hashlib.sha256(text.encode("utf-8")).digest()
        seed = int.from_bytes(digest[:4], "big")
        rng = np.random.default_rng(seed)
        vec = rng.standard_normal(EMBEDDING_DIM).astype(np.float32)
        # Unit-normalise
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.embed_text(t) for t in texts]


# ---------------------------------------------------------------------------
# Local BGE-M3 Provider (sentence-transformers)
# ---------------------------------------------------------------------------

class LocalBGEM3Provider(EmbeddingProvider):
    """
    Real BAAI/bge-m3 embeddings via sentence-transformers.

    Requires: pip install sentence-transformers
    First run will download the model (~2 GB). Only use when GPU/CPU RAM available.
    """

    def __init__(self, model_name: str = "BAAI/bge-m3"):
        try:
            from sentence_transformers import SentenceTransformer  # type: ignore
        except ImportError as exc:
            raise ImportError(
                "sentence-transformers is required for LocalBGEM3Provider. "
                "Install with: pip install sentence-transformers"
            ) from exc
        logger.info("Loading BGE-M3 model: %s (this may take a moment...)", model_name)
        self._model = SentenceTransformer(model_name, device="cpu")
        self._model_name = model_name
        logger.info("BGE-M3 model loaded.")

    @property
    def name(self) -> str:
        return f"bge_m3:{self._model_name}"

    def embed_text(self, text: str) -> List[float]:
        vec = self._model.encode(text, normalize_embeddings=True)
        return vec.tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        vecs = self._model.encode(texts, normalize_embeddings=True, batch_size=32)
        return vecs.tolist()


# ---------------------------------------------------------------------------
# OpenAI Provider (text-embedding-3-small, 1024-dim via dimensions param)
# ---------------------------------------------------------------------------

class OpenAIEmbeddingProvider(EmbeddingProvider):
    """
    OpenAI text-embedding-3-small with dimensions=1024.
    Requires: pip install openai  and  OPENAI_API_KEY env var.
    """

    def __init__(self, api_key: str | None = None, model: str = "text-embedding-3-small"):
        try:
            from openai import OpenAI  # type: ignore
        except ImportError as exc:
            raise ImportError(
                "openai package is required for OpenAIEmbeddingProvider. "
                "Install with: pip install openai"
            ) from exc
        key = api_key or os.environ.get("OPENAI_API_KEY", "")
        if not key:
            raise ValueError("OPENAI_API_KEY environment variable not set.")
        self._client = OpenAI(api_key=key)
        self._model = model

    @property
    def name(self) -> str:
        return f"openai:{self._model}"

    def embed_text(self, text: str) -> List[float]:
        response = self._client.embeddings.create(
            input=text,
            model=self._model,
            dimensions=EMBEDDING_DIM,
        )
        return response.data[0].embedding

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        response = self._client.embeddings.create(
            input=texts,
            model=self._model,
            dimensions=EMBEDDING_DIM,
        )
        return [item.embedding for item in response.data]


# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------

_PROVIDER_CACHE: dict[str, EmbeddingProvider] = {}


def get_embedding_provider(provider_name: str | None = None) -> EmbeddingProvider:
    """
    Factory: return the configured embedding provider singleton.

    Reads EMBEDDING_PROVIDER env var if provider_name is not given.
    Supported values:
        mock        → MockEmbeddingProvider (default for dev/test)
        local       → LocalBGEM3Provider (BAAI/bge-m3 via sentence-transformers)
        bge_m3      → alias for local
        openai      → OpenAIEmbeddingProvider (text-embedding-3-small)
    """
    name = (provider_name or os.environ.get("EMBEDDING_PROVIDER", "mock")).lower().strip()

    if name in _PROVIDER_CACHE:
        return _PROVIDER_CACHE[name]

    if name == "mock":
        provider: EmbeddingProvider = MockEmbeddingProvider()
    elif name in ("local", "bge_m3"):
        model = os.environ.get("EMBEDDING_MODEL", "BAAI/bge-m3")
        provider = LocalBGEM3Provider(model_name=model)
    elif name == "openai":
        provider = OpenAIEmbeddingProvider()
    else:
        logger.warning(
            "Unknown EMBEDDING_PROVIDER '%s'. Falling back to mock provider.", name
        )
        provider = MockEmbeddingProvider()

    _PROVIDER_CACHE[name] = provider
    logger.info("Embedding provider initialised: %s", provider.name)
    return provider
