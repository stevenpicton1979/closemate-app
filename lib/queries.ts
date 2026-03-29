import { db } from './db'
import { quotes, Quote } from './schema'
import { and, eq, lt, desc, notInArray, isNotNull } from 'drizzle-orm'

export async function getQuoteById(id: string): Promise<Quote | undefined> {
  return db.query.quotes.findFirst({
    where: eq(quotes.id, id),
  })
}

function todayString(): string {
  return new Date().toISOString().split('T')[0]
}

const CLOSED_STATUSES: Array<'won' | 'lost'> = ['won', 'lost']

export async function getOverdueQuotes(): Promise<Quote[]> {
  return db.query.quotes.findMany({
    where: and(
      isNotNull(quotes.followUpDate),
      lt(quotes.followUpDate, todayString()),
      notInArray(quotes.status, CLOSED_STATUSES)
    ),
    orderBy: [quotes.followUpDate],
  })
}

export async function getDueTodayQuotes(): Promise<Quote[]> {
  return db.query.quotes.findMany({
    where: and(
      eq(quotes.followUpDate, todayString()),
      notInArray(quotes.status, CLOSED_STATUSES)
    ),
    orderBy: [quotes.createdAt],
  })
}

export async function getRecentQuotes(): Promise<Quote[]> {
  return db.query.quotes.findMany({
    orderBy: [desc(quotes.createdAt)],
    limit: 5,
  })
}

const VALID_STATUSES = ['draft', 'sent', 'won', 'lost'] as const
type Status = typeof VALID_STATUSES[number]

export async function getAllQuotes(status?: string): Promise<Quote[]> {
  const filter = VALID_STATUSES.includes(status as Status) ? (status as Status) : undefined

  return db.query.quotes.findMany({
    where: filter ? eq(quotes.status, filter) : undefined,
    orderBy: [desc(quotes.createdAt)],
  })
}
