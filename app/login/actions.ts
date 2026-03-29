'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function login(formData: FormData) {
  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    redirect('/login?error=invalid')
  }

  const session = await getSession()
  session.userId = user.id
  session.email = user.email
  await session.save()

  redirect('/')
}
