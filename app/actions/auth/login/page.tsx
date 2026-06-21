import type { Handle } from 'remix/ui'

import { AuthPage, authRoutes } from '../auth-page.tsx'

export type LoginValues = {
  email?: string
}

export type LoginErrors = Partial<Record<'email' | 'password' | 'form', string>>

type LoginPageProps = {
  errors?: LoginErrors
  values?: LoginValues
}

export function LoginPage(handle: Handle<LoginPageProps>) {
  return () => {
    let { errors = {}, values = {} } = handle.props

    return (
      <AuthPage
        title="Login | Agent Admin"
        head="Private VPS agent administration panel."
        heading="Sign in to manage agents"
        command="login --scope=control-plane"
        formAction={authRoutes.loginAction}
        submitLabel="Sign in"
        alternateHref={authRoutes.signupIndex}
        alternateLabel="Create admin account"
        errors={errors}
        values={values}
        fields={[
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
            autoComplete: 'current-password',
          },
        ]}
      />
    )
  }
}
