import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'
import { theme } from 'remix/ui/theme'

export type SacredTone = 'neutral' | 'success' | 'warning' | 'danger'

export type SacredDataColumn = {
  id: string
  label: string
}

export type SacredDataRow = {
  cells: readonly RemixNode[]
  id: string
}

export type SacredDetail = {
  label: string
  mono?: boolean
  value: string
}

export function SacredPanel(
  handle: Handle<{
    children?: RemixNode
    copy?: string
    meta?: string
    path?: string
    title: string
  }>,
) {
  return () => {
    let { children, copy, meta, path, title } = handle.props
    let titleId = `${handle.id}-title`

    return (
      <section aria-labelledby={titleId} mix={panelStyle}>
        <div mix={panelHeaderStyle}>
          <div>
            {path ? <p mix={pathStyle}>{path}</p> : null}
            <h2 id={titleId} mix={panelTitleStyle}>
              {title}
            </h2>
            {copy ? <p mix={panelCopyStyle}>{copy}</p> : null}
          </div>
          {meta ? <span mix={panelMetaStyle}>{meta}</span> : null}
        </div>
        {children}
      </section>
    )
  }
}

export function SacredDataTable(
  handle: Handle<{
    columns: readonly SacredDataColumn[]
    rows: readonly SacredDataRow[]
  }>,
) {
  return () => {
    let { columns, rows } = handle.props

    return (
      <div mix={tableWrapStyle}>
        <table mix={tableStyle}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${columns[index]?.id ?? index}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export function SacredMetricGrid(handle: Handle<{ children?: RemixNode }>) {
  return () => (
    <dl mix={metricGridStyle} aria-label="Agent summary">
      {handle.props.children}
    </dl>
  )
}

export function SacredMetric(handle: Handle<{ label: string; tone?: SacredTone; value: string }>) {
  return () => {
    let { label, tone = 'neutral', value } = handle.props

    return (
      <div mix={metricStyle}>
        <dt mix={metricLabelStyle}>{label}</dt>
        <dd mix={[metricValueStyle, toneTextStyle(tone)]}>{value}</dd>
      </div>
    )
  }
}

export function SacredBadge(handle: Handle<{ children?: RemixNode; tone?: SacredTone }>) {
  return () => {
    let { children, tone = 'neutral' } = handle.props

    return <span mix={[badgeStyle, toneBadgeStyle(tone)]}>{children}</span>
  }
}

export function SacredButton(
  handle: Handle<{
    children?: RemixNode
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary'
  }>,
) {
  return () => {
    let { children, type = 'button', variant = 'secondary' } = handle.props

    return (
      <button type={type} mix={variant === 'primary' ? primaryButtonStyle : secondaryButtonStyle}>
        {children}
      </button>
    )
  }
}

export function SacredDetailList(handle: Handle<{ details: readonly SacredDetail[] }>) {
  return () => {
    let { details } = handle.props

    return (
      <dl mix={detailListStyle}>
        {details.map((detail) => (
          <div key={detail.label} mix={detailStyle}>
            <dt>{detail.label}</dt>
            <dd mix={detail.mono ? monoDetailStyle : css({})}>{detail.value}</dd>
          </div>
        ))}
      </dl>
    )
  }
}

export function SacredEventList(
  handle: Handle<{ events: readonly { text: string; time: string; tone?: SacredTone }[] }>,
) {
  return () => {
    let { events } = handle.props

    return (
      <ol mix={eventsStyle}>
        {events.map((event) => (
          <li key={`${event.time}-${event.text}`}>
            <time>{event.time}</time>
            <span mix={toneTextStyle(event.tone ?? 'neutral')}>{event.text}</span>
          </li>
        ))}
      </ol>
    )
  }
}

export const sacredMonoCellStyle = css({
  color: theme.colors.text.secondary,
  fontFamily: theme.fontFamily.mono,
  fontSize: theme.fontSize.xs,
})

export const sacredStackStyle = css({
  display: 'grid',
  gap: theme.space.lg,
})

export const sacredInlineActionsStyle = css({
  display: 'flex',
  gap: theme.space.sm,
})

export const sacredLogStyle = css({
  margin: 0,
  overflowX: 'auto',
  border: `1px solid ${theme.colors.border.subtle}`,
  borderRadius: theme.radius.sm,
  background: theme.surface.lvl0,
  color: theme.colors.text.secondary,
  fontFamily: theme.fontFamily.mono,
  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.normal,
  padding: theme.space.md,
})

const SUCCESS = '#d8ddd1'
const SUCCESS_BG = '#10120f'
const SUCCESS_BORDER = '#3a4035'
const WARNING = '#ded8c5'
const WARNING_BG = '#15130d'
const WARNING_BORDER = '#4b4634'
const DANGER = '#dec8c8'
const DANGER_BG = '#171010'
const DANGER_BORDER = '#4d3838'

function toneTextStyle(tone: SacredTone) {
  if (tone === 'success') return css({ color: SUCCESS })
  if (tone === 'warning') return css({ color: WARNING })
  if (tone === 'danger') return css({ color: DANGER })
  return css({})
}

function toneBadgeStyle(tone: SacredTone) {
  if (tone === 'success') {
    return css({ color: SUCCESS, borderColor: SUCCESS_BORDER, background: SUCCESS_BG })
  }

  if (tone === 'warning') {
    return css({ color: WARNING, borderColor: WARNING_BORDER, background: WARNING_BG })
  }

  if (tone === 'danger') {
    return css({ color: DANGER, borderColor: DANGER_BORDER, background: DANGER_BG })
  }

  return css({
    color: theme.colors.text.secondary,
    borderColor: theme.colors.border.default,
    background: theme.surface.lvl2,
  })
}

const panelStyle = css({
  minWidth: 0,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radius.sm,
  background: theme.surface.lvl1,
  overflow: 'hidden',
})

const panelHeaderStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.space.lg,
  borderBottom: `1px solid ${theme.colors.border.subtle}`,
  padding: theme.space.lg,
  '@media (max-width: 520px)': {
    display: 'grid',
  },
})

const pathStyle = css({
  marginBottom: theme.space.xs,
  color: theme.colors.focus.ring,
  fontSize: theme.fontSize.xxs,
  lineHeight: theme.lineHeight.tight,
})

const panelTitleStyle = css({
  color: theme.colors.text.primary,
  fontSize: theme.fontSize.lg,
  fontWeight: theme.fontWeight.bold,
  letterSpacing: theme.letterSpacing.normal,
  lineHeight: theme.lineHeight.tight,
})

const panelCopyStyle = css({
  color: theme.colors.text.muted,
  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.normal,
  marginTop: theme.space.sm,
})

const panelMetaStyle = css({
  alignSelf: 'start',
  border: `1px solid ${theme.colors.border.subtle}`,
  color: theme.colors.text.muted,
  fontSize: theme.fontSize.xxs,
  lineHeight: theme.lineHeight.tight,
  padding: `${theme.space.xs} ${theme.space.sm}`,
  whiteSpace: 'nowrap',
})

const tableWrapStyle = css({
  overflowX: 'auto',
})

const tableStyle = css({
  width: '100%',
  minWidth: '860px',
  borderCollapse: 'collapse',
  color: theme.colors.text.secondary,
  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.normal,
  '& th': {
    borderBottom: `1px solid ${theme.colors.border.subtle}`,
    color: theme.colors.text.muted,
    fontSize: theme.fontSize.xxs,
    fontWeight: theme.fontWeight.semibold,
    lineHeight: theme.lineHeight.tight,
    padding: `${theme.space.sm} ${theme.space.md}`,
    textAlign: 'left',
  },
  '& td': {
    borderBottom: `1px solid ${theme.colors.border.subtle}`,
    padding: `${theme.space.md} ${theme.space.md}`,
    verticalAlign: 'middle',
  },
  '& tbody tr:hover td': {
    background: theme.surface.lvl2,
  },
  '& tbody tr:last-child td': {
    borderBottom: 0,
  },
})

const metricGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(78px, 1fr))',
  gap: theme.space.sm,
  margin: 0,
  '@media (max-width: 620px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
})

const metricStyle = css({
  minWidth: 0,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.radius.sm,
  background: theme.surface.lvl1,
  padding: theme.space.md,
})

const metricLabelStyle = css({
  color: theme.colors.text.muted,
  fontSize: theme.fontSize.xxs,
  fontWeight: theme.fontWeight.semibold,
  lineHeight: theme.lineHeight.tight,
})

const metricValueStyle = css({
  margin: `${theme.space.xs} 0 0`,
  color: theme.colors.text.primary,
  fontSize: theme.fontSize.xl,
  fontWeight: theme.fontWeight.bold,
  lineHeight: theme.lineHeight.tight,
})

const badgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: theme.control.height.sm,
  border: '1px solid',
  borderRadius: theme.radius.none,
  padding: `0 ${theme.space.sm}`,
  fontSize: theme.fontSize.xxs,
  fontWeight: theme.fontWeight.semibold,
  lineHeight: theme.lineHeight.tight,
})

const buttonBase = {
  cursor: 'pointer',
  font: 'inherit',
  '&:hover, &:focus-visible': {
    outline: `1px solid ${theme.colors.focus.ring}`,
    outlineOffset: '2px',
  },
} as const

const primaryButtonStyle = css({
  ...buttonBase,
  minHeight: theme.control.height.lg,
  border: `1px solid ${theme.colors.action.primary.border}`,
  borderRadius: theme.radius.none,
  background: theme.colors.action.primary.background,
  color: theme.colors.action.primary.foreground,
  fontSize: theme.fontSize.xs,
  fontWeight: theme.fontWeight.bold,
  padding: `0 ${theme.space.md}`,
  '&:hover, &:focus-visible': {
    background: theme.colors.action.primary.backgroundHover,
    outline: `1px solid ${theme.colors.focus.ring}`,
    outlineOffset: '2px',
  },
})

const secondaryButtonStyle = css({
  ...buttonBase,
  minHeight: theme.control.height.md,
  border: `1px solid ${theme.colors.action.secondary.border}`,
  borderRadius: theme.radius.none,
  background: theme.colors.action.secondary.background,
  color: theme.colors.action.secondary.foreground,
  fontSize: theme.fontSize.xs,
  padding: `0 ${theme.space.md}`,
  '&:hover, &:focus-visible': {
    borderColor: theme.colors.focus.ring,
    outline: `1px solid ${theme.colors.focus.ring}`,
    outlineOffset: '2px',
  },
})

const detailListStyle = css({
  display: 'grid',
  gap: theme.space.sm,
  margin: 0,
})

const detailStyle = css({
  display: 'grid',
  gridTemplateColumns: '92px minmax(0, 1fr)',
  gap: theme.space.md,
  borderTop: `1px solid ${theme.colors.border.subtle}`,
  paddingTop: theme.space.sm,
  '& dt': {
    color: theme.colors.text.muted,
    fontSize: theme.fontSize.xxs,
    lineHeight: theme.lineHeight.tight,
  },
  '& dd': {
    margin: 0,
    overflow: 'hidden',
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.xs,
    lineHeight: theme.lineHeight.tight,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

const monoDetailStyle = css({
  fontFamily: theme.fontFamily.mono,
})

const eventsStyle = css({
  display: 'grid',
  gap: theme.space.sm,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '& li': {
    display: 'grid',
    gridTemplateColumns: '42px minmax(0, 1fr)',
    gap: theme.space.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.xs,
    lineHeight: theme.lineHeight.normal,
  },
  '& time': {
    color: theme.colors.text.muted,
    fontFamily: theme.fontFamily.mono,
    fontSize: theme.fontSize.xxs,
  },
})
