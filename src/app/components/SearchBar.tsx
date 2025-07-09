'use client';

import { useState } from 'react';
import { SearchResult } from '../search/page';

// ✅ NEW: Define an interface for the full API response
interface ApiResponse {
  searchResults: SearchResult[];
  generatedAnswer: string;
}

// ✅ UPDATED: Add the new prop for setting the answer
interface Props {
  setResults: (results: SearchResult[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setGeneratedAnswer: (answer: string) => void; // Add this
  loading: boolean;
}

export default function SearchBar({ setResults, setLoading, setError, setGeneratedAnswer, loading }: Props) {
  const [query, setQuery] = useState('');

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setGeneratedAnswer(''); // Clear previous answer

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      const res = await fetch(
        `${backendUrl}/docsearch/api/files/search?q=${encodeURIComponent(query)}&maxHits=100`
      );
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || 'Search request failed');
      }
      
      // ✅ CORRECTED: Use the new ApiResponse interface
      const data: ApiResponse = await res.json();
      setResults(data.searchResults || []);
      setGeneratedAnswer(data.generatedAnswer || '');

    } catch (err: unknown) {
      console.error(err);
      let errorMessage = 'An unexpected error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    // ... (The JSX for the search bar does not need to change)
    <div className="flex gap-2 max-w-2xl mx-auto">
      <input
        type="text"
        className="flex-grow px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search documents..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}