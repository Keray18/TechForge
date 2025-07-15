"use client"

export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <div className="mb-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
      {error}
    </div>
  )
} 