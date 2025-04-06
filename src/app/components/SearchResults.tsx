import { SearchResult } from '../search/page'; // 👈 same type

interface Props {
  results: SearchResult[];
}

export default function SearchResults({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <ul className="mt-6 space-y-4 max-w-2xl mx-auto">
      {results.map((res, idx) => (
        <li key={idx} className="p-4 bg-white border rounded shadow space-y-2">
          <div className="font-semibold">📄 {res.filename}</div>
          <div className="text-sm text-gray-600">Matched in: {res.matchType}</div>
          {res.snippet && (
            <div
            className="text-sm text-gray-800 italic mt-1"
            dangerouslySetInnerHTML={{ __html: `“${res.snippet}”` }}
          />
          
          )}
        </li>
      ))}
    </ul>
  );
}
