import Link from 'next/link'
import QuoteCard from '@/components/quote-card'
import { getOverdueQuotes, getDueTodayQuotes, getRecentQuotes, getAllQuotes } from '@/lib/queries'
import { getSession } from '@/lib/auth'
import { logout } from '@/app/actions'
import { redirect } from 'next/navigation'
import { Quote } from '@/lib/schema'
import HomeScreenPrompt from '@/components/home-screen-prompt'

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
]

function Section({
  title,
  quotes,
  titleClass,
  showActions,
  variant,
}: {
  title: string
  quotes: Quote[]
  titleClass?: string
  showActions?: boolean
  variant?: 'overdue' | 'today'
}) {
  if (quotes.length === 0) return null
  return (
    <section>
      <h2 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${titleClass ?? 'text-zinc-400'}`}>
        {title} ({quotes.length})
      </h2>
      <div className="space-y-2">
        {quotes.map(q => <QuoteCard key={q.id} quote={q} showActions={showActions} variant={variant} />)}
      </div>
    </section>
  )
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  const { status } = await searchParams
  const userId = session.userId

  const [overdue, dueToday, recentRaw, all] = await Promise.all([
    getOverdueQuotes(userId),
    getDueTodayQuotes(userId),
    getRecentQuotes(userId),
    getAllQuotes(userId, status),
  ])

  const priorityIds = new Set([...overdue.map(q => q.id), ...dueToday.map(q => q.id)])
  const recent = recentRaw.filter(q => !priorityIds.has(q.id))

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-12 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">CloseMate</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/quotes/new"
            className="text-sm bg-zinc-100 text-zinc-900 px-4 py-2.5 rounded-full font-medium"
          >
            + New quote
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-zinc-500 hover:text-zinc-300">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <HomeScreenPrompt />

      {/* Overdue */}
      <Section title="Overdue" quotes={overdue} titleClass="text-red-400" showActions variant="overdue" />

      {/* Due today */}
      <Section title="Due today" quotes={dueToday} titleClass="text-amber-400" showActions variant="today" />

      {/* No follow-ups state */}
      {overdue.length === 0 && dueToday.length === 0 && (
        <p className="text-sm text-zinc-500 text-center py-1">No follow-ups today 👍</p>
      )}

      {/* Recent */}
      <Section title="Recent" quotes={recent} />

      {/* All quotes */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
          All quotes
        </h2>

        {/* Status filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 no-scrollbar">
          {STATUS_FILTERS.map(f => {
            const isActive = (status ?? '') === f.value
            return (
              <Link
                key={f.value}
                href={f.value ? `/?status=${f.value}` : '/'}
                className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap border transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                    : 'text-zinc-400 border-zinc-700 bg-transparent'
                }`}
              >
                {f.label}
              </Link>
            )
          })}
        </div>

        {all.length === 0 ? (
          status ? (
            <p className="text-zinc-500 text-sm text-center py-10">No {status} quotes.</p>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-200 font-medium">No quotes yet</p>
              <p className="text-zinc-500 text-sm mt-1 mb-6">Add your first quote to start tracking jobs</p>
              <Link
                href="/quotes/new"
                className="inline-block bg-zinc-100 text-zinc-900 text-sm font-medium px-6 py-3 rounded-full"
              >
                + New quote
              </Link>
            </div>
          )
        ) : (
          <div className="space-y-2">
            {all.map(q => <QuoteCard key={q.id} quote={q} />)}
          </div>
        )}
      </section>

    </div>
  )
}
