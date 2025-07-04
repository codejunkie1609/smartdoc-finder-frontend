"use client";

import { useState } from 'react';

export default function FolderIndexer() {
  const [folderPath, setFolderPath] = useState('');
  const [progress, setProgress] = useState(0);
  const [indexStatus, setIndexStatus] = useState('');

  function triggerStreamingIndex() {
    if (!folderPath.trim()) {
      setIndexStatus('Please enter a folder path.');
      return;
    }

    setProgress(0);
    setIndexStatus('Indexing started...');
    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const url = `${backendBaseUrl}/docsearch/api/files/index-directory-stream?path=${encodeURIComponent(folderPath)}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.indexedFiles !== undefined && data.totalFiles !== undefined) {
          const percentage = (data.indexedFiles / data.totalFiles) * 100;
          setProgress(percentage);
          setIndexStatus(`Indexing: ${data.indexedFiles} of ${data.totalFiles} files`);
          if (data.indexedFiles >= data.totalFiles) {
            eventSource.close();
            setIndexStatus('✅ Indexing complete!');
          }
        }
      } catch (err) {
        console.error('Failed to parse SSE message', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('[SSE Error]', err);
      setIndexStatus('❌ An error occurred. Please check the console.');
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

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded h-4">
        <div
          className="bg-green-500 h-4 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-center text-sm mt-2">{indexStatus}</div>
    </div>
  );
}
