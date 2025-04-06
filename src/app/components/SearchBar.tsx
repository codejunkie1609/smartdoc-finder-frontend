import { useState } from 'react';
import { SearchResult } from '../search/page'; // 👈 import the type

interface Props {
  onResults: (results: SearchResult[]) => void;
}

export default function SearchBar({ onResults }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `http://localhost:8080/docsearch/api/files/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error('Search failed');
      const data: SearchResult[] = await res.json();
      onResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow px-4 py-2 border rounded"
          placeholder="Search documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
