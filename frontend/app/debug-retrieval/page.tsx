"use client";

import React, { useState } from "react";

export default function DebugRetrievalPage() {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [domain, setDomain] = useState("");
  const [tier, setTier] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    setMetadata(null);

    try {
      const payload: any = { query, top_k: 8 };
      if (jurisdiction) payload.jurisdiction = jurisdiction;
      if (domain) payload.domain_filter = [domain];
      if (tier) payload.tier_filter = [tier];

      const res = await fetch("http://localhost:8000/api/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results || []);
      setMetadata({
        total: data.total_found,
        mode: data.retrieval_mode,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Developer Retrieval Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input 
            className="border p-2 rounded col-span-1 md:col-span-4" 
            placeholder="Search query..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="border p-2 rounded" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)}>
            <option value="">Any Jurisdiction</option>
            <option value="IN">INDIA</option>
            <option value="US">USA</option>
            <option value="INTERNATIONAL">INTERNATIONAL</option>
          </select>
          <select className="border p-2 rounded" value={domain} onChange={(e) => setDomain(e.target.value)}>
            <option value="">Any Domain</option>
            <option value="REGULATORY">REGULATORY</option>
            <option value="PATENT">PATENT</option>
            <option value="BIODIVERSITY">BIODIVERSITY</option>
          </select>
          <select className="border p-2 rounded" value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="">Any Tier</option>
            <option value="TIER_1">Tier 1 (Primary)</option>
            <option value="TIER_2">Tier 2 (Intl)</option>
            <option value="TIER_3">Tier 3 (Scientific)</option>
          </select>
          <button 
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Retrieve Evidence"}
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {metadata && (
          <div className="mb-4 text-sm text-gray-600 bg-gray-100 p-3 rounded">
            <strong>Found:</strong> {metadata.total} results <br/>
            <strong>Mode:</strong> {metadata.mode}
          </div>
        )}

        <div className="space-y-4">
          {results.map((r, i) => (
            <div key={i} className="border p-4 rounded bg-gray-50 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{r.title}</h3>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-mono">
                  {r.tier} | {r.jurisdiction}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 grid grid-cols-2 gap-2">
                <div><strong>Authority:</strong> {r.authority}</div>
                <div><strong>Domain:</strong> {r.domain}</div>
                <div><strong>Section:</strong> {r.section_article || "N/A"}</div>
              </div>

              <div className="bg-white border p-3 mt-2 text-sm text-gray-800 font-serif max-h-40 overflow-y-auto">
                {r.excerpt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
