import Link from 'next/link'
import { Quote } from '@/lib/schema'
import { markWon, markLost, snoozeQuote } from '@/app/quotes/actions'

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  won: 'Won',
  lost: 'Lost',
}

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-zinc-700 text-zinc-300',
  sent: 'bg-blue-900/60 text-blue-300',
  won: 'bg-green-900/60 text-green-300',
  lost: 'bg-red-900/60 text-red-400',
}

const VARIANT_BORDER: Record<string, string> = {
  overdue: 'border-red-900/70',
  today: 'border-amber-900/60',
  default: 'border-zinc-700',
}

function formatAmount(amount: string): string {
  return '$' + Number(amount).toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
  })
}

export default function QuoteCard({
  quote,
  showActions,
  variant,
}: {
  quote: Quote
  showActions?: boolean
  variant?: 'overdue' | 'today'
}) {
  const today = new Date().toISOString().split('T')[0]
  const isOverdue = !!quote.followUpDate && quote.followUpDate < today
  const borderClass = VARIANT_BORDER[variant ?? 'default']

  const wonAction = markWon.bind(null, quote.id)
  const lostAction = markLost.bind(null, quote.id)
  const snoozeAction = snoozeQuote.bind(null, quote.id)

  return (
    <div className={`border ${borderClass} rounded-xl overflow-hidden`}>
      <Link
        href={`/quotes/${quote.id}`}
        className="flex items-start justify-between gap-3 bg-zinc-800 p-4 active:bg-zinc-700"
      >
        <div className="min-w-0">
          <p className="font-medium text-zinc-100 truncate">{quote.customerName}</p>
          <p className="text-sm text-zinc-400 truncate mt-0.5">{quote.jobDescription}</p>
          {quote.followUpDate && (
            <p className={`text-xs mt-2 ${isOverdue ? 'text-red-400 font-medium' : 'text-zinc-500'}`}>
              Follow-up {formatDate(quote.followUpDate)}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="font-medium text-zinc-100">{formatAmount(quote.quoteAmount)}</p>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${STATUS_COLOR[quote.status]}`}>
            {STATUS_LABEL[quote.status]}
          </span>
        </div>
      </Link>

      {showActions && (
        <div className="flex gap-2 px-3 py-2.5 bg-zinc-900/60 border-t border-zinc-700/50">
          <form action={wonAction} className="flex-1">
            <button type="submit" className="w-full text-xs font-medium text-green-400 py-2 rounded-lg border border-green-900/50 bg-green-900/20 active:bg-green-900/40">
              Won
            </button>
          </form>
          <form action={lostAction} className="flex-1">
            <button type="submit" className="w-full text-xs font-medium text-red-400 py-2 rounded-lg border border-red-900/50 bg-red-900/20 active:bg-red-900/40">
              Lost
            </button>
          </form>
          <form action={snoozeAction} className="flex-1">
            <button type="submit" className="w-full text-xs font-medium text-zinc-300 py-2 rounded-lg border border-zinc-600 bg-zinc-700/40 active:bg-zinc-600/50">
              Snooze
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
