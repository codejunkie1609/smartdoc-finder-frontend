'use client';

import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

export interface SearchResult {
  filename: string;
  matchType: string;
  snippet?: string;
}

export default function SearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">SmartDoc Search</h1>
      <SearchBar onResults={setResults} />
      <SearchResults results={results} />
    </main>
  );
}
