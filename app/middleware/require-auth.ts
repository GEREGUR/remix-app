import { requireAuth } from 'remix/middleware/auth'
import { redirect } from 'remix/response/redirect'

import type { UserIdentity } from '../data/schema.ts'
import { routes } from '../routes.ts'

export function requireAdminAuth() {
  return requireAuth<UserIdentity>({
    onFailure() {
      return redirect(routes.auth.login.index.href())
    },
  })
}
