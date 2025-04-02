'use client';

export default function BrokenComponent({ name }: { name: string }) {
  if (!name) {
    throw new Error('The `name` prop is required but was missing.');
  }

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded">
      Hello, {name}!
    </div>
  );
}
