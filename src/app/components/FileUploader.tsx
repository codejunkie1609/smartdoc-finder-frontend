'use client';

import { useState } from 'react';
import axios from 'axios';

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) return `Server error: ${error.response.statusText}`;
    if (error.request) return '⚠️ No response from server. Check your connection.';
    return `Request failed: ${error.message}`;
  }
  if (error instanceof Error) return `Unexpected error: ${error.message}`;
  return 'An unknown error occurred.';
}

function logError(error: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Dev Error Log]', error);
    }
  
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     message: (error as any)?.message || 'Unknown error',
    //     stack: (error as any)?.stack || '',
    //     time: new Date().toISOString(),
    //   }),
    // }).catch(console.error);
  }

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  function onFileSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setSelectedFile(files[0]);
  }

  async function uploadFile() {
    if (!selectedFile) {
      setUploadStatus('Please select a file.');
      return;
    }

    setUploadStatus('Uploading...');
    const data = new FormData();
    data.append('file', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:8080/docsearch/api/files/upload',
        data
      );
      console.log(response);
      setUploadStatus('Uploaded successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      logError(error);
      setUploadStatus(message);
    }
  }

  return (
    <div className="p-4 bg-gray-200 max-w-md mx-auto space-y-4 rounded border-2">
  <div className="space-y-4">
    
    <div className="w-full flex justify-center">
      <input
        type="file"
        onChange={(e) => onFileSelected(e.target.files)}
        className="text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0 file:text-xl file:font-semibold
          file:bg-blue-50 file:text-blue-700 "
      />
    </div>


    <div className="w-full flex justify-center">
      <button
        onClick={uploadFile}
        className="bg-blue-600 text-white px-4 py-2 rounded text-xl"
      >
        Upload
      </button>
    </div>
  </div>

  {uploadStatus && (
    <div className="text-l p-2 bg-gray-100 border border-gray-300 rounded text-center">
      {uploadStatus}
    </div>
  )}
</div>


  );
}
