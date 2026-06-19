import { completeAuth } from 'remix/auth'
import { Database } from 'remix/data-table'
import * as s from 'remix/data-schema'
import { email, maxLength, minLength } from 'remix/data-schema/checks'
import * as coerce from 'remix/data-schema/coerce'
import * as f from 'remix/data-schema/form-data'
import { createController } from 'remix/router'
import { redirect } from 'remix/response/redirect'

import { hashPassword } from '../../../data/passwords.ts'
import { toUserIdentity, users } from '../../../data/schema.ts'
import { setAuthSession } from '../../../middleware/auth.ts'
import { routes } from '../../../routes.ts'
import { SignupPage, type SignupErrors, type SignupValues } from './page.tsx'

const signupSchema = f.object({
  name: f.field(
    coerce
      .string()
      .transform((value) => value.trim())
      .pipe(minLength(1), maxLength(100)),
  ),
  email: f.field(
    coerce
      .string()
      .transform((value) => value.trim().toLowerCase())
      .pipe(email(), maxLength(255)),
  ),
  password: f.field(s.string().pipe(minLength(8), maxLength(128))),
})

export default createController(routes.auth.signup, {
  actions: {
    index(context) {
      return context.render(<SignupPage />)
    },
    async action(context) {
      let formData = context.get(FormData)
      let result = s.parseSafe(signupSchema, formData)
      let values = getSignupValues(formData)

      if (!result.success) {
        return context.render(<SignupPage errors={getSignupErrors(result.issues)} values={values} />, {
          status: 400,
        })
      }

      let db = context.get(Database)
      let existingUser = await db.findOne(users, { where: { email: result.value.email } })

      if (existingUser) {
        return context.render(
          <SignupPage
            errors={{ email: 'An account already exists for this email.' }}
            values={values}
          />,
          { status: 409 },
        )
      }

      let user = await db.create(
        users,
        {
          name: result.value.name,
          email: result.value.email,
          password_hash: await hashPassword(result.value.password),
        },
        { returnRow: true },
      )

      let session = completeAuth(context)
      setAuthSession(session, toUserIdentity(user))

      return redirect(routes.dashboard.href(), 303)
    },
  },
})

function getSignupValues(formData: FormData): SignupValues {
  return {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
  }
}

function getSignupErrors(issues: readonly s.Issue[]): SignupErrors {
  let errors: SignupErrors = {}

  for (let issue of issues) {
    let field = issue.path?.[0]

    if ((field === 'name' || field === 'email' || field === 'password') && !errors[field]) {
      errors[field] = issue.message
      continue
    }

    errors.form ??= issue.message
  }

  return errors
}
