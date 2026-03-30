'use server'

import { db } from '@/lib/db'
import { quotes } from '@/lib/schema'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function createQuote(formData: FormData) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  const customerName = (formData.get('customerName') as string).trim()
  const jobDescription = (formData.get('jobDescription') as string).trim()
  const quoteAmount = formData.get('quoteAmount') as string
  const status = (formData.get('status') as string) || 'draft'
  const followUpDate = formData.get('followUpDate') as string
  const breakdown = (formData.get('breakdown') as string).trim()
  const notes = (formData.get('notes') as string).trim()

  await db.insert(quotes).values({
    userId: session.userId,
    customerName,
    jobDescription,
    quoteAmount,
    status: status as 'draft' | 'sent' | 'won' | 'lost',
    followUpDate: followUpDate || null,
    breakdown: breakdown || null,
    notes: notes || null,
  })

  redirect('/')
}
