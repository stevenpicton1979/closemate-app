'use server'

import { db } from '@/lib/db'
import { quotes } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function updateQuote(id: string, formData: FormData) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  const jobDescription = (formData.get('jobDescription') as string).trim()
  const status = formData.get('status') as 'draft' | 'sent' | 'won' | 'lost'
  const followUpDate = formData.get('followUpDate') as string
  const breakdown = (formData.get('breakdown') as string).trim()
  const notes = (formData.get('notes') as string).trim()
  const quoteAmountRaw = formData.get('quoteAmount') as string | null

  const updateFields: Record<string, unknown> = {
    jobDescription,
    status,
    followUpDate: followUpDate || null,
    breakdown: breakdown || null,
    notes: notes || null,
    updatedAt: new Date(),
  }
  if (quoteAmountRaw) {
    updateFields.quoteAmount = quoteAmountRaw
  }

  await db
    .update(quotes)
    .set(updateFields)
    .where(and(eq(quotes.id, id), eq(quotes.userId, session.userId)))

  redirect('/')
}
