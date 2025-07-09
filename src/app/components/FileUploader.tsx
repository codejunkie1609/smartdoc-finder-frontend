"use client";

import { useState, useEffect } from 'react';

export default function FolderIndexer() {
  const [progress, setProgress] = useState(0);
  const [indexStatus, setIndexStatus] = useState('');

  useEffect(() => {
    startIndexing();
  }, []);

  function startIndexing() {
    setProgress(0);
    setIndexStatus('Indexing started...');

    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const url = `${backendBaseUrl}/docsearch/api/files/index-directory-stream`;

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
        } else if (data.error) {
          setIndexStatus(`❌ ${data.error}`);
          eventSource.close();
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
      <h2 className="text-2xl font-bold text-center">Indexing Folder on Server</h2>

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
// Note: Make sure to set the NEXT_PUBLIC_BACKEND_URL environment variable in your .env file or Docker configuration.