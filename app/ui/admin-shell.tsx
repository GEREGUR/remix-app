import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'

import type { UserIdentity } from '../data/schema.ts'
import { routes } from '../routes.ts'
import { Document } from './document.tsx'

type AdminShellProps = {
  active: 'dashboard' | 'agents' | 'settings'
  children?: RemixNode
  title: string
  user: UserIdentity
}

const FONT_STACK =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

export function AdminShell(handle: Handle<AdminShellProps>) {
  return () => {
    let { active, children, title, user } = handle.props

    return (
      <Document title={`${title} | Agent Admin`}>
        <div mix={shellStyle}>
          <aside mix={sidebarStyle}>
            <a href={routes.dashboard.href()} mix={brandStyle} aria-label="Agent Admin dashboard">
              <span mix={brandMarkStyle}>A</span>
              <span>Agent Admin</span>
            </a>
            <nav aria-label="Primary" mix={navStyle}>
              <a
                href={routes.dashboard.href()}
                aria-current={active === 'dashboard' ? 'page' : undefined}
                mix={navItemStyle}
              >
                Dashboard
              </a>
              <span aria-disabled="true" mix={[navItemStyle, disabledNavItemStyle]}>
                Agents
              </span>
              <span aria-disabled="true" mix={[navItemStyle, disabledNavItemStyle]}>
                Settings
              </span>
            </nav>
          </aside>
          <div mix={workspaceStyle}>
            <header mix={topbarStyle}>
              <div mix={accountStyle}>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <form method="post" action={routes.auth.logout.action.href()}>
                <button type="submit" mix={logoutButtonStyle}>
                  Sign out
                </button>
              </form>
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
  gridTemplateColumns: '224px minmax(0, 1fr)',
  background: '#0f1419',
  color: '#f6f8fb',
  fontFamily: FONT_STACK,
  '@media (max-width: 860px)': {
    gridTemplateColumns: '1fr',
  },
})

const sidebarStyle = css({
  borderRight: '1px solid #26313d',
  background: '#111820',
  padding: '20px 16px',
  '@media (max-width: 860px)': {
    borderRight: 0,
    borderBottom: '1px solid #26313d',
  },
})

const brandStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  color: '#f6f8fb',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 780,
  lineHeight: 1,
})

const brandMarkStyle = css({
  display: 'grid',
  placeItems: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '8px',
  background: '#4f8cff',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 800,
})

const navStyle = css({
  display: 'grid',
  gap: '4px',
  marginTop: '28px',
  '@media (max-width: 860px)': {
    gridTemplateColumns: 'repeat(3, max-content)',
    gap: '8px',
    marginTop: '18px',
    overflowX: 'auto',
  },
})

const navItemStyle = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: '36px',
  borderRadius: '6px',
  padding: '0 10px',
  color: '#aab5c2',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 680,
  lineHeight: 1,
  '&[aria-current="page"]': {
    color: '#f6f8fb',
    background: '#1b2632',
  },
})

const disabledNavItemStyle = css({
  opacity: 0.48,
})

const workspaceStyle = css({
  minWidth: 0,
  display: 'grid',
  gridTemplateRows: '64px minmax(0, 1fr)',
})

const topbarStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  borderBottom: '1px solid #26313d',
  padding: '0 24px',
  '@media (max-width: 520px)': {
    padding: '12px 16px',
    minHeight: '64px',
  },
})

const accountStyle = css({
  display: 'grid',
  gap: '2px',
  minWidth: 0,
  '& strong': {
    color: '#f6f8fb',
    fontSize: '14px',
    lineHeight: 1.25,
  },
  '& span': {
    color: '#8996a5',
    fontSize: '12px',
    lineHeight: 1.25,
  },
})

const logoutButtonStyle = css({
  minHeight: '36px',
  border: '1px solid #354253',
  borderRadius: '6px',
  padding: '0 12px',
  background: '#151c23',
  color: '#d7dee7',
  font: 'inherit',
  fontSize: '13px',
  fontWeight: 720,
  cursor: 'pointer',
  '&:hover, &:focus-visible': {
    borderColor: '#4f8cff',
    color: '#ffffff',
    outline: 'none',
  },
})

const contentStyle = css({
  minWidth: 0,
  padding: '28px 24px',
  '@media (max-width: 640px)': {
    padding: '20px 16px',
  },
})
