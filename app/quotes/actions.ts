'use server'

import { db } from '@/lib/db'
import { quotes } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function markWon(id: string) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  await db.update(quotes)
    .set({ status: 'won', updatedAt: new Date() })
    .where(and(eq(quotes.id, id), eq(quotes.userId, session.userId)))
  revalidatePath('/')
}

export async function markLost(id: string) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  await db.update(quotes)
    .set({ status: 'lost', updatedAt: new Date() })
    .where(and(eq(quotes.id, id), eq(quotes.userId, session.userId)))
  revalidatePath('/')
}

export async function snoozeQuote(id: string) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  await db.update(quotes)
    .set({ followUpDate: tomorrowStr, updatedAt: new Date() })
    .where(and(eq(quotes.id, id), eq(quotes.userId, session.userId)))
  revalidatePath('/')
}
