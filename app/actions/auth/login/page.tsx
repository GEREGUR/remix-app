import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'

import { routes } from '../../../routes.ts'
import { Document } from '../../../ui/document.tsx'

export type LoginValues = {
  email?: string
}

export type LoginErrors = Partial<Record<'email' | 'password' | 'form', string>>

type LoginPageProps = {
  errors?: LoginErrors
  values?: LoginValues
}

const FONT_STACK =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

export function LoginPage(handle: Handle<LoginPageProps>) {
  return () => {
    let { errors = {}, values = {} } = handle.props

    return (
      <Document title="Login | Agent Admin" head={<LoginHead />}>
        <main
          mix={css({
            minHeight: '100vh',
            background: '#0f1419',
            color: '#f6f8fb',
            fontFamily: FONT_STACK,
            display: 'grid',
            placeItems: 'center',
            padding: '32px 16px',
          })}
        >
          <section
            aria-labelledby="login-title"
            mix={css({
              width: '100%',
              maxWidth: '420px',
              background: '#151c23',
              border: '1px solid #27313d',
              borderRadius: '8px',
              padding: '28px',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.32)',
            })}
          >
            <header mix={css({ marginBottom: '24px' })}>
              <p
                mix={css({
                  margin: '0 0 8px',
                  color: '#9da8b5',
                  fontSize: '14px',
                  lineHeight: 1.4,
                })}
              >
                Agent Admin
              </p>
              <h1
                id="login-title"
                mix={css({
                  margin: 0,
                  fontSize: '28px',
                  lineHeight: 1.14,
                  fontWeight: 700,
                  letterSpacing: 0,
                })}
              >
                Sign in to manage agents
              </h1>
            </header>

            {errors.form ? <FormError>{errors.form}</FormError> : null}

            <form method="post" action={routes.auth.login.action.href()} mix={formStyle}>
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
                autoComplete="current-password"
                error={errors.password}
              />
              <button
                type="submit"
                mix={css({
                  width: '100%',
                  minHeight: '44px',
                  border: 0,
                  borderRadius: '6px',
                  background: '#4f8cff',
                  color: '#ffffff',
                  font: 'inherit',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                  '&:hover, &:focus-visible': {
                    background: '#2f73f5',
                    outline: 'none',
                  },
                })}
              >
                Sign in
              </button>
            </form>
          </section>
        </main>
      </Document>
    )
  }
}

function LoginHead() {
  return () => <meta name="description" content="Private VPS agent administration panel." />
}

function Field(
  handle: Handle<{
    label: string
    name: string
    type: 'email' | 'password'
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
              borderColor: '#e35f66',
              boxShadow: '0 0 0 3px rgba(227, 95, 102, 0.14)',
            })
          : css({}),
      ],
    }

    return (
      <label mix={css({ display: 'grid', gap: '8px' })}>
        <span mix={labelStyle}>{label}</span>
        {type === 'email' ? (
          <input {...inputProps} type="email" />
        ) : (
          <input {...inputProps} type="password" />
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
        background: '#351d24',
        border: '1px solid #71323b',
        borderRadius: '6px',
        color: '#ffd7db',
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
  color: '#d8dee6',
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: 1.4,
})

const inputStyle = css({
  width: '100%',
  minHeight: '44px',
  border: '1px solid #35414f',
  borderRadius: '6px',
  padding: '10px 12px',
  color: '#f6f8fb',
  background: '#10161c',
  font: 'inherit',
  outline: 'none',
  '&:focus': {
    borderColor: '#4f8cff',
    boxShadow: '0 0 0 3px rgba(79, 140, 255, 0.18)',
  },
})

const errorTextStyle = css({
  color: '#ffb8be',
  fontSize: '13px',
  lineHeight: 1.35,
})
