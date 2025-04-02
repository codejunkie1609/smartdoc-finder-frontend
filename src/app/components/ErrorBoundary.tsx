'use client';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import * as Sentry from '@sentry/nextjs';

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div
      role="alert"
      className="p-4 bg-red-100 border border-red-400 rounded text-red-700"
    >
      <p className="font-semibold">Something went wrong:</p>
      <pre className="mt-2 text-sm">{error.message}</pre>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={resetErrorBoundary}
      >
        Try Again
      </button>
    </div>
  );
}

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Error caught by boundary:', error);
        Sentry.captureException(error); // ✅ Log to Sentry
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
