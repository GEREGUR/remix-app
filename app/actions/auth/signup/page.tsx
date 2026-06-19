import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'

import { routes } from '../../../routes.ts'
import { Document } from '../../../ui/document.tsx'

export type SignupValues = {
  name?: string
  email?: string
}

export type SignupErrors = Partial<Record<'name' | 'email' | 'password' | 'form', string>>

type SignupPageProps = {
  errors?: SignupErrors
  values?: SignupValues
}

const FONT_STACK =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

export function SignupPage(handle: Handle<SignupPageProps>) {
  return () => {
    let { errors = {}, values = {} } = handle.props

    return (
      <Document title="Sign up | Finance Tracker" head={<SignupHead />}>
        <main
          mix={css({
            minHeight: '100vh',
            background: '#f6f7f9',
            color: '#17181c',
            fontFamily: FONT_STACK,
            display: 'grid',
            placeItems: 'center',
            padding: '32px 16px',
          })}
        >
          <section
            aria-labelledby="signup-title"
            mix={css({
              width: '100%',
              maxWidth: '420px',
              background: '#ffffff',
              border: '1px solid #dedfe3',
              borderRadius: '8px',
              padding: '28px',
              boxShadow: '0 18px 48px rgba(23, 24, 28, 0.08)',
            })}
          >
            <header mix={css({ marginBottom: '24px' })}>
              <p
                mix={css({
                  margin: '0 0 8px',
                  color: '#5d6470',
                  fontSize: '14px',
                  lineHeight: 1.4,
                })}
              >
                Finance Tracker
              </p>
              <h1
                id="signup-title"
                mix={css({
                  margin: 0,
                  fontSize: '28px',
                  lineHeight: 1.14,
                  fontWeight: 700,
                  letterSpacing: 0,
                })}
              >
                Create your account
              </h1>
            </header>

            {errors.form ? <FormError>{errors.form}</FormError> : null}

            <form method="post" action={routes.auth.signup.action.href()} mix={formStyle}>
              <Field
                label="Name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                error={errors.name}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                error={errors.email}
              />
              <Field
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                error={errors.password}
              />
              <button
                type="submit"
                mix={css({
                  width: '100%',
                  minHeight: '44px',
                  border: 0,
                  borderRadius: '6px',
                  background: '#1062fe',
                  color: '#ffffff',
                  font: 'inherit',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                  '&:hover, &:focus-visible': {
                    background: '#084bc8',
                    outline: 'none',
                  },
                })}
              >
                Sign up
              </button>
            </form>
          </section>
        </main>
      </Document>
    )
  }
}

function SignupHead() {
  return () => (
    <>
      <meta
        name="description"
        content="Create a Finance Tracker account to start tracking accounts, budgets, and spending."
      />
    </>
  )
}

function Field(
  handle: Handle<{
    label: string
    name: string
    type: 'text' | 'email' | 'password'
    autoComplete: string
    value?: string
    error?: string
  }>,
) {
  return () => {
    let { label, name, type, autoComplete, value, error } = handle.props
    let errorId = `${name}-error`
    let inputProps = {
      name,
      autoComplete,
      defaultValue: value,
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? errorId : undefined,
      mix: [
        inputStyle,
        error
          ? css({
              borderColor: '#c4272f',
              boxShadow: '0 0 0 3px rgba(196, 39, 47, 0.12)',
            })
          : css({}),
      ],
    }

    return (
      <label mix={css({ display: 'grid', gap: '8px' })}>
        <span mix={labelStyle}>{label}</span>
        {type === 'email' ? (
          <input {...inputProps} type="email" />
        ) : type === 'password' ? (
          <input {...inputProps} type="password" />
        ) : (
          <input {...inputProps} type="text" />
        )}
        {error ? (
          <span id={errorId} mix={errorTextStyle}>
            {error}
          </span>
        ) : null}
      </label>
    )
  }
}

function FormError(handle: Handle<{ children: string }>) {
  return () => (
    <p
      role="alert"
      mix={css({
        margin: '0 0 16px',
        padding: '10px 12px',
        background: '#fff1f1',
        border: '1px solid #f2c7c9',
        borderRadius: '6px',
        color: '#922029',
        fontSize: '14px',
        lineHeight: 1.4,
      })}
    >
      {handle.props.children}
    </p>
  )
}

const formStyle = css({
  display: 'grid',
  gap: '16px',
})

const labelStyle = css({
  color: '#343842',
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: 1.4,
})

const inputStyle = css({
  width: '100%',
  minHeight: '44px',
  border: '1px solid #c9ccd3',
  borderRadius: '6px',
  padding: '10px 12px',
  color: '#17181c',
  background: '#ffffff',
  font: 'inherit',
  outline: 'none',
  '&:focus': {
    borderColor: '#1062fe',
    boxShadow: '0 0 0 3px rgba(16, 98, 254, 0.14)',
  },
})

const errorTextStyle = css({
  color: '#922029',
  fontSize: '13px',
  lineHeight: 1.35,
})
