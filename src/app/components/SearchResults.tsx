'use client';

import { useState, useEffect } from 'react';
import { SearchResult } from '../search/page'; // Import the main interface

interface Props {
  results: SearchResult[];
}

const RESULTS_PER_PAGE = 10;

export default function SearchResults({ results }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Reset to the first page whenever a new search is performed
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  // If there are no results, show a message
  if (results.length === 0) {
    return <div className="text-center text-gray-500 mt-8">No results found.</div>;
  }
  
  // Calculate the items for the current page
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const currentResults = results.slice(startIndex, startIndex + RESULTS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="mt-6">
      {/* List of results */}
      <div className="space-y-4">
        {currentResults.map((result) => (
          // The 'id' from your backend is crucial for the key
          <div key={result.id} className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-blue-700">{result.filename}</h3>
            <p 
              className="text-sm text-gray-600 mt-1"
              dangerouslySetInnerHTML={{ __html: result.snippet || '' }} 
            />
            <div className="text-xs text-gray-400 mt-2">
              <span>Type: {result.matchType}</span> | <span>Score: {result.hybridScore.toFixed(4)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-700">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}