import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Role } from '@prisma/client'

export async function getSession() {
  return auth()
}

export async function requireSession() {
  const session = await auth()
  if (!session) redirect('/login')
  return session
}

export async function requireRole(...roles: Role[]) {
  const session = await requireSession()
  if (!roles.includes(session.user.role as Role)) {
    redirect('/')
  }
  return session
}

export async function requireAdmin() {
  return requireRole('ADMIN')
}

export async function getSessionForApi() {
  const session = await auth()
  if (!session) return null
  if (!session.user.active) return null
  return session
}
