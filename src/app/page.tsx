import FileUploader from './components/FileUploader';
import ErrorBoundary from './components/ErrorBoundary'; 
import * as Sentry from '@sentry/nextjs';
import BrokenComponent from './components/BrokenComponent';

async function getData() {
  try {
    const res = await fetch('http://localhost:8080/broken-endpoint', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Backend fetch failed:', error);
    Sentry.captureException(error); 
    return null;
  }
}

export default async function HomePage() {
  const data = await getData();

  return (
    <main className="min-h-screen p-8 bg-orange-100 space-y-6">
      <h1 className="text-xl font-bold">SmartDoc File Upload</h1>

      {data === null ? (
        <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded">
          ⚠️ Could not fetch backend data. The server might be down.
        </div>
      ) : (
        <div className="p-4 bg-green-100 border border-green-300 rounded text-sm">
          Backend data: {JSON.stringify(data)}
        </div>
      )}

      <ErrorBoundary>
        <FileUploader />
        <BrokenComponent name={undefined as any} />
      </ErrorBoundary>
    </main>
  );
}
