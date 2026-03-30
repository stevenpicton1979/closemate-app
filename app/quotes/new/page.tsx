import Link from 'next/link'
import { createQuote } from './actions'
import SubmitButton from '@/components/submit-button'
import PricingSection from '@/components/pricing-section'

const inputClass = 'w-full border border-zinc-700 rounded-lg px-3 py-3 text-base bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent'
const labelClass = 'block text-sm font-medium text-zinc-300 mb-1'
const optionalSpan = <span className="text-zinc-500 font-normal">(optional)</span>

function tomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function NewQuotePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-16">

      <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
        ← Back
      </Link>

      <h1 className="text-lg font-semibold mt-4 mb-6">New quote</h1>

      <form action={createQuote} className="space-y-5">

        <div>
          <label htmlFor="customerName" className={labelClass}>Customer name</label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            required
            autoFocus
            autoComplete="off"
            enterKeyHint="next"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="jobDescription" className={labelClass}>
            Job description {optionalSpan}
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            rows={3}
            enterKeyHint="next"
            className={inputClass}
          />
        </div>

        <PricingSection required />

        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <select id="status" name="status" className={inputClass} defaultValue="draft">
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
            defaultValue={tomorrow()}
            enterKeyHint="next"
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
            rows={3}
            enterKeyHint="done"
            className={inputClass}
          />
        </div>

        <SubmitButton label="Save quote" />

      </form>
    </div>
  )
}
