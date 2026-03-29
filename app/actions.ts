'use server'

import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function logout() {
  const session = await getSession()
  session.destroy()
  redirect('/login')
}
