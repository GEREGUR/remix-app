import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'
import { theme } from 'remix/ui/theme'

import type { UserIdentity } from '../data/schema.ts'
import { routes } from '../routes.ts'
import { Document } from './document.tsx'

type AdminShellProps = {
  active: 'dashboard' | 'agents' | 'settings'
  children?: RemixNode
  title: string
  user: UserIdentity
}

export function AdminShell(handle: Handle<AdminShellProps>) {
  return () => {
    let { active, children, title, user } = handle.props

    return (
      <Document title={`${title} | Agent Admin`}>
        <div mix={shellStyle}>
          <aside mix={sidebarStyle}>
            <a href={routes.dashboard.href()} mix={brandStyle} aria-label="Agent Admin dashboard">
              <span mix={brandMarkStyle}>AA</span>
              <span>Agent Admin</span>
            </a>

            <nav aria-label="Primary" mix={navStyle}>
              <a
                href={routes.dashboard.href()}
                aria-current={active === 'dashboard' ? 'page' : undefined}
                mix={navItemStyle}
              >
                <span>01</span>
                <span>Dashboard</span>
              </a>
              <span aria-disabled="true" mix={[navItemStyle, disabledNavItemStyle]}>
                <span>02</span>
                <span>Agents</span>
              </span>
              <span aria-disabled="true" mix={[navItemStyle, disabledNavItemStyle]}>
                <span>03</span>
                <span>Settings</span>
              </span>
            </nav>
          </aside>

          <div mix={workspaceStyle}>
            <header mix={topbarStyle}>
              <div mix={commandBarStyle}>
                <span aria-hidden="true">&gt;</span>
                <span>agent-admin dashboard --live</span>
              </div>

              <div mix={accountWrapStyle}>
                <div mix={accountStyle}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <form method="post" action={routes.auth.logout.action.href()}>
                  <button type="submit" mix={logoutButtonStyle}>
                    Sign out
                  </button>
                </form>
              </div>
            </header>

            <div mix={contentStyle}>{children}</div>
          </div>
        </div>
      </Document>
    )
  }
}

const shellStyle = css({
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: '220px minmax(0, 1fr)',
  background: theme.surface.lvl0,
  color: theme.colors.text.primary,
  fontFamily: theme.fontFamily.sans,
  '@media (max-width: 860px)': {
    gridTemplateColumns: '1fr',
  },
})

const sidebarStyle = css({
  borderRight: `1px solid ${theme.colors.border.default}`,
  background: theme.surface.lvl1,
  padding: theme.space.lg,
  '@media (max-width: 860px)': {
    borderRight: 0,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    padding: theme.space.md,
  },
})

const brandStyle = css({
  display: 'grid',
  gridTemplateColumns: '32px minmax(0, 1fr)',
  alignItems: 'center',
  gap: theme.space.md,
  color: theme.colors.text.primary,
  fontSize: theme.fontSize.sm,
  fontWeight: theme.fontWeight.bold,
  lineHeight: theme.lineHeight.tight,
  textDecoration: 'none',
  '&:focus-visible': {
    outline: `1px solid ${theme.colors.focus.ring}`,
    outlineOffset: '4px',
  },
})

const brandMarkStyle = css({
  display: 'grid',
  placeItems: 'center',
  width: '32px',
  height: '32px',
  border: `1px solid ${theme.colors.border.strong}`,
  borderRadius: theme.radius.none,
  color: theme.colors.focus.ring,
  fontSize: theme.fontSize.xxs,
  fontWeight: theme.fontWeight.bold,
})

const navStyle = css({
  display: 'grid',
  gap: theme.space.xs,
  marginTop: theme.space.xxl,
  '@media (max-width: 860px)': {
    gridAutoFlow: 'column',
    gridAutoColumns: 'max-content',
    gap: theme.space.sm,
    marginTop: theme.space.lg,
    overflowX: 'auto',
    paddingBottom: theme.space.xs,
  },
})

const navItemStyle = css({
  display: 'grid',
  gridTemplateColumns: '24px minmax(0, 1fr)',
  alignItems: 'center',
  minHeight: theme.control.height.md,
  border: `1px solid transparent`,
  borderRadius: theme.radius.none,
  color: theme.colors.text.muted,
  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.tight,
  padding: `0 ${theme.space.sm}`,
  textDecoration: 'none',
  '& span:first-child': {
    color: theme.colors.text.muted,
  },
  '&[aria-current="page"]': {
    borderColor: theme.colors.border.default,
    background: theme.surface.lvl2,
    color: theme.colors.text.primary,
  },
  '&[aria-current="page"] span:first-child': {
    color: theme.colors.focus.ring,
  },
  '&:focus-visible': {
    outline: `1px solid ${theme.colors.focus.ring}`,
    outlineOffset: '2px',
  },
})

const disabledNavItemStyle = css({
  opacity: 0.52,
})

const workspaceStyle = css({
  minWidth: 0,
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr)',
})

const topbarStyle = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: theme.space.lg,
  minHeight: '58px',
  borderBottom: `1px solid ${theme.colors.border.default}`,
  background: theme.surface.lvl0,
  padding: `0 ${theme.space.xl}`,
  '@media (max-width: 760px)': {
    gridTemplateColumns: '1fr',
    alignItems: 'stretch',
    padding: theme.space.md,
  },
})

const commandBarStyle = css({
  display: 'flex',
  minWidth: 0,
  gap: theme.space.sm,
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

const accountWrapStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  gap: theme.space.lg,
  minWidth: 0,
  '@media (max-width: 760px)': {
    justifyContent: 'space-between',
  },
  '@media (max-width: 420px)': {
    display: 'grid',
    justifyContent: 'stretch',
  },
})

const accountStyle = css({
  display: 'grid',
  gap: theme.space.xs,
  minWidth: 0,
  textAlign: 'right',
  '& strong': {
    overflow: 'hidden',
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    lineHeight: theme.lineHeight.tight,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& span': {
    overflow: 'hidden',
    color: theme.colors.text.muted,
    fontSize: theme.fontSize.xxs,
    lineHeight: theme.lineHeight.tight,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '@media (max-width: 760px)': {
    textAlign: 'left',
  },
})

const logoutButtonStyle = css({
  minHeight: theme.control.height.md,
  border: `1px solid ${theme.colors.action.secondary.border}`,
  borderRadius: theme.radius.sm,
  background: theme.colors.action.secondary.background,
  color: theme.colors.action.secondary.foreground,
  cursor: 'pointer',
  font: 'inherit',
  fontSize: theme.fontSize.xs,
  fontWeight: theme.fontWeight.semibold,
  padding: `0 ${theme.space.md}`,
  '&:hover, &:focus-visible': {
    borderColor: theme.colors.focus.ring,
    color: theme.colors.text.primary,
    outline: `1px solid ${theme.colors.focus.ring}`,
    outlineOffset: '2px',
  },
})

const contentStyle = css({
  minWidth: 0,
  padding: theme.space.xl,
  '@media (max-width: 640px)': {
    padding: theme.space.lg,
  },
})
