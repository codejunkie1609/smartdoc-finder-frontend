import { useState } from 'react';
import { SearchResult } from '../search/page';

interface Props {
  onResults: (results: SearchResult[]) => void;
}

const RESULTS_PER_PAGE = 10;

export default function SearchBar({ onResults }: Props) {
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPages = Math.ceil(allResults.length / RESULTS_PER_PAGE);

  const updateVisibleResults = (page: number, fullResults: SearchResult[]) => {
    const start = (page - 1) * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    onResults(fullResults.slice(start, end));
  };

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setCurrentPage(1);

    try {
      const res = await fetch(
        `http://localhost:8080/docsearch/api/files/search?q=${encodeURIComponent(query)}&maxHits=100`
      );
      if (!res.ok) throw new Error('Search failed');
      const data: SearchResult[] = await res.json();
      setAllResults(data);
      updateVisibleResults(1, data);
    } catch (err) {
      console.error(err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (delta: number) => {
    const newPage = currentPage + delta;
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    updateVisibleResults(newPage, allResults);
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
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

      {/* Pagination controls */}
      {allResults.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-700">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
