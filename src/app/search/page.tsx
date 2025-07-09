'use client';

import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { ClipLoader } from 'react-spinners';

export interface SearchResult {
  id: string;
  filename: string;
  matchType: string;
  snippet?: string;
  hybridScore: number;
}

export default function SearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [generatedAnswer, setGeneratedAnswer] = useState<string>(''); // This state is now used
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">SmartDoc Search</h1>
        
        {/* ✅ CORRECTED: Pass the new prop */}
        <SearchBar 
          setResults={setResults} 
          setLoading={setLoading} 
          setError={setError}
          setGeneratedAnswer={setGeneratedAnswer}
          loading={loading}
        />

        {loading && (
          <div className="flex justify-center mt-8">
            <ClipLoader size={50} color={"#123abc"} />
          </div>
        )}
        
        {error && (
          <div className="text-center mt-8 p-4 bg-red-100 text-red-700 rounded">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Render the generated answer */}
        {generatedAnswer && !loading && (
          <div className="p-4 bg-blue-50 rounded-lg shadow-md my-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Answer:</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{generatedAnswer}</p>
          </div>
        )}

        {!loading && !error && (
          <SearchResults results={results} />
        )}
      </div>
    </main>
  );
}