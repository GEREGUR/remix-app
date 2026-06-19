import { completeAuth, createCredentialsAuthProvider, verifyCredentials } from 'remix/auth'
import { Database } from 'remix/data-table'
import * as s from 'remix/data-schema'
import { email, maxLength, minLength } from 'remix/data-schema/checks'
import * as coerce from 'remix/data-schema/coerce'
import * as f from 'remix/data-schema/form-data'
import { createController } from 'remix/router'
import { redirect } from 'remix/response/redirect'

import { verifyPassword } from '../../../data/passwords.ts'
import { toUserIdentity, users } from '../../../data/schema.ts'
import { setAuthSession } from '../../../middleware/auth.ts'
import { routes } from '../../../routes.ts'
import { LoginPage, type LoginErrors, type LoginValues } from './page.tsx'

const loginSchema = f.object({
  email: f.field(
    coerce
      .string()
      .transform((value) => value.trim().toLowerCase())
      .pipe(email(), maxLength(255)),
  ),
  password: f.field(s.string().pipe(minLength(1), maxLength(128))),
})

const passwordProvider = createCredentialsAuthProvider({
  parse(context) {
    let result = s.parseSafe(loginSchema, context.get(FormData))

    if (!result.success) {
      return null
    }

    return result.value
  },
  async verify(credentials, context) {
    if (!credentials) {
      return null
    }

    let db = context.get(Database)
    if (!db) {
      return null
    }

    let user = await db.findOne(users, { where: { email: credentials.email } })

    if (!user || !(await verifyPassword(credentials.password, user.password_hash))) {
      return null
    }

    return user
  },
})

export default createController(routes.auth.login, {
  actions: {
    index(context) {
      return context.render(<LoginPage />)
    },
    async action(context) {
      let formData = context.get(FormData)
      let user = await verifyCredentials(passwordProvider, context)
      let values = getLoginValues(formData)

      if (!user) {
        return context.render(
          <LoginPage
            errors={{ form: 'Use a valid email and password for this admin panel.' }}
            values={values}
          />,
          { status: 401 },
        )
      }

      let session = completeAuth(context)
      setAuthSession(session, toUserIdentity(user))

      return redirect(routes.dashboard.href(), 303)
    },
  },
})

function getLoginValues(formData: FormData): LoginValues {
  return {
    email: String(formData.get('email') ?? ''),
  }
}

export function getLoginErrors(issues: readonly s.Issue[]): LoginErrors {
  let errors: LoginErrors = {}

  for (let issue of issues) {
    let field = issue.path?.[0]

    if ((field === 'email' || field === 'password') && !errors[field]) {
      errors[field] = issue.message
      continue
    }

    errors.form ??= issue.message
  }

  return errors
}
