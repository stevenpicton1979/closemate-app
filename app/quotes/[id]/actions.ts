'use server'

import { db } from '@/lib/db'
import { quotes } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function updateQuote(id: string, formData: FormData) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  const status = formData.get('status') as 'draft' | 'sent' | 'won' | 'lost'
  const followUpDate = formData.get('followUpDate') as string
  const notes = (formData.get('notes') as string).trim()

  await db
    .update(quotes)
    .set({
      status,
      followUpDate: followUpDate || null,
      notes: notes || null,
      updatedAt: new Date(),
    })
    .where(and(eq(quotes.id, id), eq(quotes.userId, session.userId)))

  redirect('/')
}
