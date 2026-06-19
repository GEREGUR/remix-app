import { Database } from 'remix/data-table'
import { auth, createSessionAuthScheme } from 'remix/middleware/auth'
import type { Session } from 'remix/session'

import { toUserIdentity, users, type UserIdentity } from '../data/schema.ts'

type AuthSessionValue = {
  userId: number
}

export function loadAuth() {
  return auth({
    schemes: [
      createSessionAuthScheme<UserIdentity, AuthSessionValue>({
        name: 'session',
        read(session) {
          let value = session.get('auth')
          return isAuthSessionValue(value) ? value : null
        },
        async verify(value, context) {
          let db = context.get(Database)
          if (!db) return null

          let user = await db.find(users, value.userId)
          return user ? toUserIdentity(user) : null
        },
        invalidate(session) {
          clearAuthSession(session)
        },
      }),
    ],
  })
}

export function setAuthSession(session: Session, user: UserIdentity) {
  session.set('auth', { userId: user.id })
}

function clearAuthSession(session: Session) {
  session.unset('auth')
}

function isAuthSessionValue(value: unknown): value is AuthSessionValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'userId' in value &&
    typeof value.userId === 'number'
  )
}
