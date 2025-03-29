// src/app/page.tsx
'use client';

import { useState } from 'react';

type Decision = {
  ada: string;
  subject: string;
  issueDate: number;
  url: string;
  organizationId: string;
  // You can extend this type with more fields as needed.
};

export default function Home() {
  const [term, setTerm] = useState('');
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await res.json();
      // The Diavgeia API (simple search) returns the decisions under the "decisions" key.
      setDecisions(data.decisions || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error fetching data');
      } else {
        setError('Error fetching data');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Diavgeia Search</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter search keywords"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          style={{ width: '300px', padding: '0.5rem' }}
        />
        <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {decisions.length === 0 && !loading && <p>No decisions found.</p>}
        {decisions.map((decision, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h2>{decision.subject}</h2>
            <p>
              <strong>ADA:</strong> {decision.ada}
            </p>
            <p>
              <strong>Issue Date:</strong> {new Date(decision.issueDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Link:</strong>{' '}
              <a href={decision.url} target="_blank" rel="noopener noreferrer">
                {decision.url}
              </a>
            </p>
            <p>
              <strong>Organization ID:</strong> {decision.organizationId}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
