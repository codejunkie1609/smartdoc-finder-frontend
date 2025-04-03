import FileUploader from './components/FileUploader';
import ErrorBoundary from './components/ErrorBoundary'; 
import * as Sentry from '@sentry/nextjs';



export default async function HomePage() {
  // const data = await getData();

  return (
    <main className="min-h-screen p-8 bg-orange-100 space-y-6">
      <h1 className="text-xl font-bold">SmartDoc File Upload</h1>

     

      <ErrorBoundary>
        <FileUploader />
        
      </ErrorBoundary>
    </main>
  );
}
