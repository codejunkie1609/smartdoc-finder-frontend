'use client';

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
        <p className="text-gray-700 mt-2">{error.message}</p>
      </body>
    </html>
  );
}
