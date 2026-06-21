import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'
import { theme } from 'remix/ui/theme'

import { routes } from '../../routes.ts'
import { Document } from '../../ui/document.tsx'

type AuthField = {
  autoComplete: string
  label: string
  name: string
  type: 'text' | 'email' | 'password'
}

type AuthErrors = Record<string, string | undefined>
type AuthValues = Record<string, string | undefined>

type AuthPageProps = {
  alternateHref: string
  alternateLabel: string
  command: string
  errors?: AuthErrors
  fields: readonly AuthField[]
  formAction: string
  head: string
  heading: string
  submitLabel: string
  title: string
  values?: AuthValues
}

export function AuthPage(handle: Handle<AuthPageProps>) {
  return () => {
    let {
      alternateHref,
      alternateLabel,
      command,
      errors = {},
      fields,
      formAction,
      head,
      heading,
      submitLabel,
      title,
      values = {},
    } = handle.props

    return (
      <Document title={title} head={<AuthHead description={head} />}>
        <main mix={pageStyle}>
          <section aria-labelledby="auth-title" mix={terminalStyle}>
            <header mix={chromeStyle}>
              <div mix={trafficStyle} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p mix={pathStyle}>/agent-admin/auth</p>
            </header>

            <div mix={bodyStyle}>
              <div mix={commandStyle}>
                <span aria-hidden="true">&gt;</span>
                <span>{command}</span>
              </div>

              <header mix={headerStyle}>
                <p mix={eyebrowStyle}>AGENT ADMIN</p>
                <h1 id="auth-title" mix={headingStyle}>
                  {heading}
                </h1>
              </header>

              {errors.form ? <FormError>{errors.form}</FormError> : null}

              <form method="post" action={formAction} mix={formStyle}>
                {fields.map((field) => (
                  <Field
                    key={field.name}
                    {...field}
                    value={values[field.name]}
                    error={errors[field.name]}
                  />
                ))}

                <button type="submit" mix={submitStyle}>
                  {submitLabel}
                </button>
              </form>

              <a href={alternateHref} mix={secondaryLinkStyle}>
                {alternateLabel}
              </a>
            </div>
          </section>
        </main>
      </Document>
    )
  }
}

export const authRoutes = {
  loginIndex: routes.auth.login.index.href(),
  loginAction: routes.auth.login.action.href(),
  signupIndex: routes.auth.signup.index.href(),
  signupAction: routes.auth.signup.action.href(),
}

function AuthHead(handle: Handle<{ description: string }>) {
  return () => <meta name="description" content={handle.props.description} />
}

function Field(
  handle: Handle<AuthField & { value?: string; error?: string }>,
) {
  return () => {
    let { autoComplete, error, label, name, type, value } = handle.props
    let errorId = `${name}-error`

    return (
      <label mix={fieldStyle}>
        <span mix={labelStyle}>{label}</span>
        {type === 'email' ? (
          <input
            name={name}
            type="email"
            autoComplete={autoComplete}
            defaultValue={value}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            mix={[inputStyle, error ? invalidInputStyle : css({})]}
          />
        ) : type === 'password' ? (
          <input
            name={name}
            type="password"
            autoComplete={autoComplete}
            defaultValue={value}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            mix={[inputStyle, error ? invalidInputStyle : css({})]}
          />
        ) : (
          <input
            name={name}
            type="text"
            autoComplete={autoComplete}
            defaultValue={value}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            mix={[inputStyle, error ? invalidInputStyle : css({})]}
          />
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
    <p role="alert" mix={formErrorStyle}>
      <span aria-hidden="true">!</span>
      <span>{handle.props.children}</span>
    </p>
  )
}

const DANGER = '#dec8c8'
const DANGER_BG = '#171010'
const DANGER_BORDER = '#4d3838'

const pageStyle = css({
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: theme.space.xxl,
  background: theme.surface.lvl0,
  color: theme.colors.text.primary,
  fontFamily: theme.fontFamily.sans,
  '@media (max-width: 520px)': {
    padding: theme.space.lg,
    placeItems: 'stretch',
  },
})

const terminalStyle = css({
  width: '100%',
  maxWidth: '480px',
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radius.lg,
  background: theme.surface.lvl1,
  boxShadow: theme.shadow.xs,
  '@media (max-width: 520px)': {
    alignSelf: 'center',
  },
})

const chromeStyle = css({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'center',
  gap: theme.space.md,
  minHeight: theme.control.height.md,
  borderBottom: `1px solid ${theme.colors.border.subtle}`,
  padding: `0 ${theme.space.md}`,
  background: theme.surface.lvl2,
})

const trafficStyle = css({
  display: 'flex',
  gap: theme.space.sm,
  '& span': {
    width: '6px',
    height: '6px',
    border: `1px solid ${theme.colors.border.strong}`,
    borderRadius: theme.radius.none,
    background: theme.surface.lvl0,
  },
})

const pathStyle = css({
  overflow: 'hidden',
  color: theme.colors.text.muted,
  fontSize: theme.fontSize.xxs,
  lineHeight: theme.lineHeight.tight,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const bodyStyle = css({
  display: 'grid',
  gap: theme.space.xl,
  padding: theme.space.xl,
  '@media (max-width: 520px)': {
    padding: theme.space.lg,
  },
})

const commandStyle = css({
  display: 'flex',
  gap: theme.space.sm,
  minWidth: 0,
  border: `1px solid ${theme.colors.border.subtle}`,
  background: theme.surface.lvl0,
  padding: `${theme.space.sm} ${theme.space.md}`,
  color: theme.colors.text.secondary,
  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.tight,
  '& span:first-child': {
    color: theme.colors.focus.ring,
  },
  '& span:last-child': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

const headerStyle = css({
  display: 'grid',
  gap: theme.space.sm,
})

const eyebrowStyle = css({
  color: theme.colors.text.muted,
  fontSize: theme.fontSize.xxs,
  fontWeight: theme.fontWeight.bold,
  letterSpacing: theme.letterSpacing.meta,
  lineHeight: theme.lineHeight.tight,
})

const headingStyle = css({
  color: theme.colors.text.primary,
  fontSize: theme.fontSize.xxl,
  fontWeight: theme.fontWeight.bold,
  letterSpacing: theme.letterSpacing.normal,
  lineHeight: theme.lineHeight.tight,
  '@media (max-width: 390px)': {
    fontSize: theme.fontSize.xl,
  },
})

const formStyle = css({
  display: 'grid',
  gap: theme.space.lg,
})

const fieldStyle = css({
  display: 'grid',
  gap: theme.space.sm,
})

const labelStyle = css({
  color: theme.colors.text.secondary,
  fontSize: theme.fontSize.xs,
  fontWeight: theme.fontWeight.semibold,
  lineHeight: theme.lineHeight.tight,
})

const inputStyle = css({
  width: '100%',
  minHeight: theme.control.height.lg,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radius.sm,
  background: theme.surface.lvl0,
  color: theme.colors.text.primary,
  font: 'inherit',
  fontSize: theme.fontSize.sm,
  outline: 'none',
  padding: `${theme.space.sm} ${theme.space.md}`,
  '&:focus': {
    borderColor: theme.colors.focus.ring,
    boxShadow: `0 0 0 1px ${theme.colors.focus.ring}`,
  },
})

const invalidInputStyle = css({
  borderColor: DANGER_BORDER,
  boxShadow: `0 0 0 1px ${DANGER_BORDER}`,
})

const submitStyle = css({
  width: '100%',
  minHeight: theme.control.height.lg,
  border: `1px solid ${theme.colors.action.primary.border}`,
  borderRadius: theme.radius.sm,
  background: theme.colors.action.primary.background,
  color: theme.colors.action.primary.foreground,
  cursor: 'pointer',
  font: 'inherit',
  fontSize: theme.fontSize.sm,
  fontWeight: theme.fontWeight.bold,
  lineHeight: theme.lineHeight.tight,
  '&:hover, &:focus-visible': {
    background: theme.colors.action.primary.backgroundHover,
    outline: `1px solid ${theme.colors.focus.ring}`,
    outlineOffset: '2px',
  },
  '&:active': {
    background: theme.colors.action.primary.backgroundActive,
  },
})

const secondaryLinkStyle = css({
  justifySelf: 'start',
  color: theme.colors.text.link,
  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.tight,
  textDecoration: 'none',
  '&:hover, &:focus-visible': {
    color: theme.colors.action.primary.backgroundHover,
    outline: `1px solid ${theme.colors.focus.ring}`,
    outlineOffset: '3px',
  },
})

const formErrorStyle = css({
  display: 'grid',
  gridTemplateColumns: '16px minmax(0, 1fr)',
  gap: theme.space.sm,
  border: `1px solid ${DANGER_BORDER}`,
  borderRadius: theme.radius.sm,
  background: DANGER_BG,
  color: DANGER,
  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.normal,
  padding: `${theme.space.sm} ${theme.space.md}`,
})

const errorTextStyle = css({
  color: DANGER,
  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.normal,
})
