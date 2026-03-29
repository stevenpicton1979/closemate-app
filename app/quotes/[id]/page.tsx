import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getQuoteById } from '@/lib/queries'
import { getSession } from '@/lib/auth'
import { updateQuote } from './actions'

const inputClass = 'w-full border border-zinc-700 rounded-lg px-3 py-3 text-base bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent'
const labelClass = 'block text-sm font-medium text-zinc-300 mb-1'
const optionalSpan = <span className="text-zinc-500 font-normal">(optional)</span>

function formatAmount(amount: string): string {
  return '$' + Number(amount).toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session.userId) redirect('/login')

  const quote = await getQuoteById(id, session.userId)
  if (!quote) notFound()

  const action = updateQuote.bind(null, quote.id)

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-12">

      <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
        ← Back
      </Link>

      {/* Read-only summary: name and amount only */}
      <div className="mt-4 mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">{quote.customerName}</h1>
        <p className="text-2xl font-semibold text-zinc-100 mt-1">{formatAmount(quote.quoteAmount)}</p>
      </div>

      <div className="border-t border-zinc-700 mb-6" />

      {/* Editable fields — all four always rendered */}
      <form action={action} className="space-y-5">

        <div>
          <label htmlFor="jobDescription" className={labelClass}>
            Job description {optionalSpan}
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            rows={3}
            defaultValue={quote.jobDescription ?? ''}
            placeholder="Describe the job..."
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <select
            id="status"
            name="status"
            defaultValue={quote.status}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div>
          <label htmlFor="followUpDate" className={labelClass}>
            Follow-up date {optionalSpan}
          </label>
          <input
            id="followUpDate"
            name="followUpDate"
            type="date"
            defaultValue={quote.followUpDate ?? ''}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>
            Notes {optionalSpan}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={quote.notes ?? ''}
            placeholder="Add notes about this job..."
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-100 text-zinc-900 text-sm font-medium py-3 rounded-full mt-2"
        >
          Save changes
        </button>

      </form>
    </div>
  )
}
