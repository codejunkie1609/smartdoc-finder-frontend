'use client';

import { useState } from 'react';

export default function FolderIndexer() {
  const [folderPath, setFolderPath] = useState('');
  const [indexStatus, setIndexStatus] = useState('');

  function triggerStreamingIndex() {
    if (!folderPath.trim()) {
      setIndexStatus('Please enter a folder path.');
      return;
    }

    setIndexStatus('Indexing in progress...\n');
    const url = `http://localhost:8080/docsearch/api/files/index-directory-stream?path=${encodeURIComponent(folderPath)}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      setIndexStatus((prev) => prev + event.data + '\n');
    };

    eventSource.onerror = (err) => {
      console.error('[SSE Error]', err);
      setIndexStatus((prev) => prev + '\n❌ An error occurred. Please check the console.');
      eventSource.close();
    };

    eventSource.onopen = () => {
      console.log('✅ SSE connection opened');
    };
  }

  return (
    <div className="p-6 bg-gray-100 max-w-xl mx-auto rounded-lg border space-y-4">
      <h2 className="text-2xl font-bold text-center">Index Folder on Server</h2>

      <input
        type="text"
        placeholder="Enter full path (e.g., /data/documents)"
        value={folderPath}
        onChange={(e) => setFolderPath(e.target.value)}
        className="w-full px-4 py-2 border rounded text-lg"
      />

      <div className="w-full flex justify-center">
        <button
          onClick={triggerStreamingIndex}
          className="bg-blue-600 text-white px-6 py-2 rounded text-lg hover:bg-blue-700"
        >
          Start Indexing
        </button>
      </div>

      {indexStatus && (
        <div className="p-3 bg-white border border-gray-300 rounded text-left text-sm whitespace-pre-line font-mono">
          {indexStatus}
        </div>
      )}
    </div>
  );
}
