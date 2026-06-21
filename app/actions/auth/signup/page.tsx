import type { Handle } from 'remix/ui'

import { AuthPage, authRoutes } from '../auth-page.tsx'

export type SignupValues = {
  name?: string
  email?: string
}

export type SignupErrors = Partial<Record<'name' | 'email' | 'password' | 'form', string>>

type SignupPageProps = {
  errors?: SignupErrors
  values?: SignupValues
}

export function SignupPage(handle: Handle<SignupPageProps>) {
  return () => {
    let { errors = {}, values = {} } = handle.props

    return (
      <AuthPage
        title="Sign up | Agent Admin"
        head="Create an account for the private VPS agent admin panel."
        heading="Create your admin account"
        command="init-admin --provider=credentials"
        formAction={authRoutes.signupAction}
        submitLabel="Sign up"
        alternateHref={authRoutes.loginIndex}
        alternateLabel="Return to sign in"
        errors={errors}
        values={values}
        fields={[
          {
            label: 'Name',
            name: 'name',
            type: 'text',
            autoComplete: 'name',
          },
          {
            label: 'Email',
            name: 'email',
            type: 'email',
            autoComplete: 'email',
          },
          {
            label: 'Password',
            name: 'password',
            type: 'password',
            autoComplete: 'new-password',
          },
        ]}
      />
    )
  }
}
