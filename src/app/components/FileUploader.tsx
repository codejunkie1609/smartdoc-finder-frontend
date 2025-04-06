'use client';

import { useState } from 'react';
import { uploadDocument } from '../services/documentService';
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
    try {
      await uploadDocument(selectedFile); 
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
              file:bg-blue-50 file:text-blue-700"
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
