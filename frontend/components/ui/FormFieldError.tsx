"use client"

export function FormFieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <div className="mt-1 text-xs text-red-600">{error}</div>
  )
} 