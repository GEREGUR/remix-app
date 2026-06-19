import { createCookie } from 'remix/cookie'
import { session } from 'remix/middleware/session'
import { createFsSessionStorage } from 'remix/session-storage/fs'

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET is required in production')
}

export const sessionCookie = createCookie('__finance_session', {
  secrets: [sessionSecret ?? 'dev-only-change-me'],
  httpOnly: true,
  sameSite: 'Lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
})

export const sessionStorage = createFsSessionStorage('./tmp/sessions')

export function loadSession() {
  return session(sessionCookie, sessionStorage)
}
