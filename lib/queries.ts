import { db } from './db'
import { quotes, Quote } from './schema'
import { and, eq, lt, desc, notInArray, isNotNull } from 'drizzle-orm'

function todayString(): string {
  return new Date().toISOString().split('T')[0]
}

const CLOSED_STATUSES: Array<'won' | 'lost'> = ['won', 'lost']

export async function getQuoteById(id: string, userId: string): Promise<Quote | undefined> {
  return db.query.quotes.findFirst({
    where: and(eq(quotes.id, id), eq(quotes.userId, userId)),
  })
}

export async function getOverdueQuotes(userId: string): Promise<Quote[]> {
  return db.query.quotes.findMany({
    where: and(
      eq(quotes.userId, userId),
      isNotNull(quotes.followUpDate),
      lt(quotes.followUpDate, todayString()),
      notInArray(quotes.status, CLOSED_STATUSES)
    ),
    orderBy: [quotes.followUpDate],
  })
}

export async function getDueTodayQuotes(userId: string): Promise<Quote[]> {
  return db.query.quotes.findMany({
    where: and(
      eq(quotes.userId, userId),
      eq(quotes.followUpDate, todayString()),
      notInArray(quotes.status, CLOSED_STATUSES)
    ),
    orderBy: [quotes.createdAt],
  })
}

export async function getRecentQuotes(userId: string): Promise<Quote[]> {
  return db.query.quotes.findMany({
    where: eq(quotes.userId, userId),
    orderBy: [desc(quotes.createdAt)],
    limit: 5,
  })
}

const VALID_STATUSES = ['draft', 'sent', 'won', 'lost'] as const
type Status = typeof VALID_STATUSES[number]

export async function getAllQuotes(userId: string, status?: string): Promise<Quote[]> {
  const filter = VALID_STATUSES.includes(status as Status) ? (status as Status) : undefined

  return db.query.quotes.findMany({
    where: filter
      ? and(eq(quotes.userId, userId), eq(quotes.status, filter))
      : eq(quotes.userId, userId),
    orderBy: [desc(quotes.createdAt)],
  })
}
