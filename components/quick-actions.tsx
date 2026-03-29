'use client'

import { useTransition, useState } from 'react'
import { markWon, markLost, snoozeQuote } from '@/app/quotes/actions'

export default function QuickActions({ quoteId }: { quoteId: string }) {
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<string | null>(null)

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  function run(action: (id: string) => Promise<void>, message: string) {
    startTransition(async () => {
      await action(quoteId)
      showToast(message)
    })
  }

  return (
    <>
      <div className="flex gap-2 px-3 py-2.5 bg-zinc-900/60 border-t border-zinc-700/50">
        <button
          onClick={() => run(markWon, 'Marked as won')}
          disabled={isPending}
          className="flex-1 text-xs font-medium text-green-400 py-2 rounded-lg border border-green-900/50 bg-green-900/20 active:bg-green-900/40 disabled:opacity-40"
        >
          Won
        </button>
        <button
          onClick={() => run(markLost, 'Marked as lost')}
          disabled={isPending}
          className="flex-1 text-xs font-medium text-red-400 py-2 rounded-lg border border-red-900/50 bg-red-900/20 active:bg-red-900/40 disabled:opacity-40"
        >
          Lost
        </button>
        <button
          onClick={() => run(snoozeQuote, 'Reminder set for tomorrow')}
          disabled={isPending}
          className="flex-1 text-xs font-medium text-zinc-300 py-2 rounded-lg border border-zinc-600 bg-zinc-700/40 active:bg-zinc-600/50 disabled:opacity-40"
        >
          Remind tomorrow
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-700 border border-zinc-600 text-zinc-100 text-sm px-5 py-2.5 rounded-full shadow-xl z-50 pointer-events-none whitespace-nowrap toast-enter">
          {toast}
        </div>
      )}
    </>
  )
}
