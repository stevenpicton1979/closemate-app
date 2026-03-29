'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-zinc-100 text-zinc-900 text-sm font-medium py-3 rounded-full mt-2 disabled:opacity-50"
    >
      {pending ? (pendingLabel ?? 'Saving...') : label}
    </button>
  )
}
