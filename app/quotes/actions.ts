'use server'

import { db } from '@/lib/db'
import { quotes } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function markWon(id: string) {
  await db.update(quotes)
    .set({ status: 'won', updatedAt: new Date() })
    .where(eq(quotes.id, id))
  revalidatePath('/')
}

export async function markLost(id: string) {
  await db.update(quotes)
    .set({ status: 'lost', updatedAt: new Date() })
    .where(eq(quotes.id, id))
  revalidatePath('/')
}

export async function snoozeQuote(id: string) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  await db.update(quotes)
    .set({ followUpDate: tomorrowStr, updatedAt: new Date() })
    .where(eq(quotes.id, id))
  revalidatePath('/')
}
