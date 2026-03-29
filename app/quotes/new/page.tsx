import Link from 'next/link'
import { createQuote } from './actions'

const inputClass = 'w-full border border-zinc-700 rounded-lg px-3 py-3 text-base bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent'
const labelClass = 'block text-sm font-medium text-zinc-300 mb-1'

export default function NewQuotePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-12">

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
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="jobDescription" className={labelClass}>Job description</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            required
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="quoteAmount" className={labelClass}>Quote amount ($)</label>
          <input
            id="quoteAmount"
            name="quoteAmount"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className={inputClass}
          />
        </div>

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
            Follow-up date <span className="text-zinc-500 font-normal">(optional)</span>
          </label>
          <input
            id="followUpDate"
            name="followUpDate"
            type="date"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>
            Notes <span className="text-zinc-500 font-normal">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-100 text-zinc-900 text-sm font-medium py-3 rounded-full mt-2"
        >
          Save quote
        </button>

      </form>
    </div>
  )
}
