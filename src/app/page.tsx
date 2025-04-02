import FileUploader from './components/FileUploader';

export default function HomePage() {
  return (
    <main className="min-h-screen p-8 bg-orange-100">
      <h1 className="text-xl font-bold mb-4">SmartDoc File Upload</h1>
      <FileUploader />
    </main>
  );
}
