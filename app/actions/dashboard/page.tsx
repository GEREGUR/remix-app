import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'

import type { UserIdentity } from '../../data/schema.ts'
import { AdminShell } from '../../ui/admin-shell.tsx'

type DashboardAgent = {
  id: string
  name: string
  runtime: string
  ref: string
  status: 'running' | 'stopped' | 'failed' | 'unknown'
  host: string
  version: string
  lastDeploy: string
  cpu: string
  memory: string
}

type DashboardPageProps = {
  user: UserIdentity
  agents: readonly DashboardAgent[]
}

export function DashboardPage(handle: Handle<DashboardPageProps>) {
  return () => {
    let { user, agents } = handle.props
    let running = agents.filter((agent) => agent.status === 'running').length
    let stopped = agents.filter((agent) => agent.status === 'stopped').length
    let failed = agents.filter((agent) => agent.status === 'failed').length
    let selectedAgent = agents[0]

    return (
      <AdminShell user={user} active="dashboard" title="Dashboard">
        <main mix={pageStyle}>
          <header mix={headerStyle}>
            <div>
              <h1 mix={titleStyle}>Agent control plane</h1>
              <p mix={subtitleStyle}>Monitor deployed agents and run safe operational actions.</p>
            </div>
            <dl mix={summaryStyle} aria-label="Agent summary">
              <Metric label="Total" value={String(agents.length)} />
              <Metric label="Running" value={String(running)} tone="success" />
              <Metric label="Stopped" value={String(stopped)} tone="warning" />
              <Metric label="Failed" value={String(failed)} tone="danger" />
            </dl>
          </header>

          <div mix={operationsGridStyle}>
            <section aria-labelledby="agents-title" mix={panelStyle}>
              <div mix={panelHeaderStyle}>
                <div>
                  <h2 id="agents-title" mix={sectionTitleStyle}>
                    Managed agents
                  </h2>
                  <p mix={sectionCopyStyle}>Seed data until the runtime adapter is connected.</p>
                </div>
              </div>

              <div mix={tableWrapStyle}>
                <table mix={tableStyle}>
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Status</th>
                      <th>Runtime ref</th>
                      <th>Version</th>
                      <th>CPU</th>
                      <th>Memory</th>
                      <th>Last deploy</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id}>
                        <td>
                          <strong mix={agentNameStyle}>{agent.name}</strong>
                          <span mix={agentMetaStyle}>{agent.host}</span>
                        </td>
                        <td>
                          <StatusBadge status={agent.status} />
                        </td>
                        <td mix={monoCellStyle}>{agent.ref}</td>
                        <td>{agent.version}</td>
                        <td>{agent.cpu}</td>
                        <td>{agent.memory}</td>
                        <td>{agent.lastDeploy}</td>
                        <td>
                          <div mix={rowActionsStyle}>
                            <button type="button" mix={tableActionStyle}>
                              Restart
                            </button>
                            <button type="button" mix={tableActionStyle}>
                              Deploy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <aside aria-labelledby="selected-agent-title" mix={railStyle}>
              <div>
                <h2 id="selected-agent-title" mix={sectionTitleStyle}>
                  {selectedAgent.name}
                </h2>
                <p mix={sectionCopyStyle}>Selected agent operations and latest telemetry.</p>
              </div>

              <dl mix={detailListStyle}>
                <Detail label="Runtime" value={selectedAgent.runtime} />
                <Detail label="Reference" value={selectedAgent.ref} mono />
                <Detail label="Version" value={selectedAgent.version} />
                <Detail label="Host" value={selectedAgent.host} />
              </dl>

              <div mix={commandGridStyle} aria-label="Safe operations">
                <button type="button" mix={primaryCommandStyle}>
                  Restart
                </button>
                <button type="button" mix={secondaryCommandStyle}>
                  Stop
                </button>
                <button type="button" mix={secondaryCommandStyle}>
                  Deploy
                </button>
              </div>

              <section aria-labelledby="events-title" mix={railSectionStyle}>
                <h3 id="events-title" mix={railTitleStyle}>
                  Recent events
                </h3>
                <ol mix={eventsStyle}>
                  <Event time="12:42" text="Health check passed" tone="success" />
                  <Event time="12:31" text="Restart requested by admin" />
                  <Event time="12:26" text="Deploy 2026.06.18-4 completed" />
                </ol>
              </section>

              <section aria-labelledby="logs-title" mix={railSectionStyle}>
                <h3 id="logs-title" mix={railTitleStyle}>
                  Log preview
                </h3>
                <pre mix={logStyle}>{`12:42:18 ready on port 7410
12:42:21 heartbeat ok
12:43:02 queue depth 0
12:43:10 worker pool stable`}</pre>
              </section>
            </aside>
          </div>
        </main>
      </AdminShell>
    )
  }
}

function Metric(
  handle: Handle<{ label: string; value: string; tone?: 'success' | 'warning' | 'danger' }>,
) {
  return () => {
    let { label, value, tone } = handle.props

    return (
      <div mix={metricStyle}>
        <dt mix={metricLabelStyle}>{label}</dt>
        <dd
          mix={[
            metricValueStyle,
            tone === 'success'
              ? css({ color: '#55c28d' })
              : tone === 'warning'
                ? css({ color: '#e8b85c' })
                : tone === 'danger'
                  ? css({ color: '#ef7279' })
                  : css({}),
          ]}
        >
          {value}
        </dd>
      </div>
    )
  }
}

function Detail(handle: Handle<{ label: string; value: string; mono?: boolean }>) {
  return () => {
    let { label, value, mono } = handle.props

    return (
      <div mix={detailStyle}>
        <dt>{label}</dt>
        <dd mix={mono ? monoDetailValueStyle : css({})}>{value}</dd>
      </div>
    )
  }
}

function Event(handle: Handle<{ time: string; text: string; tone?: 'success' }>) {
  return () => {
    let { time, text, tone } = handle.props

    return (
      <li>
        <time>{time}</time>
        <span mix={tone === 'success' ? css({ color: '#8bf0bd' }) : css({})}>{text}</span>
      </li>
    )
  }
}

function StatusBadge(handle: Handle<{ status: DashboardAgent['status'] }>) {
  return () => {
    let { status } = handle.props

    return (
      <span
        mix={[
          badgeStyle,
          status === 'running'
            ? css({ color: '#8bf0bd', background: '#133526', borderColor: '#27694b' })
            : status === 'stopped'
              ? css({ color: '#ffd28a', background: '#3a2a14', borderColor: '#76521d' })
              : status === 'failed'
                ? css({ color: '#ffb8be', background: '#3b1f25', borderColor: '#7d3842' })
                : css({ color: '#b6c0cc', background: '#202932', borderColor: '#394655' }),
        ]}
      >
        {status}
      </span>
    )
  }
}

const pageStyle = css({
  display: 'grid',
  gap: '24px',
})

const headerStyle = css({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
  gap: '24px',
  '@media (max-width: 820px)': {
    display: 'grid',
    alignItems: 'start',
  },
})

const titleStyle = css({
  margin: 0,
  color: '#f6f8fb',
  fontSize: '32px',
  lineHeight: 1.12,
  fontWeight: 760,
  letterSpacing: 0,
})

const subtitleStyle = css({
  margin: '8px 0 0',
  color: '#97a4b3',
  fontSize: '15px',
  lineHeight: 1.5,
})

const summaryStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(88px, 1fr))',
  gap: '10px',
  margin: 0,
  '@media (max-width: 640px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
})

const metricStyle = css({
  minWidth: 0,
  border: '1px solid #283442',
  borderRadius: '8px',
  background: '#151c23',
  padding: '12px 14px',
})

const metricLabelStyle = css({
  color: '#8996a5',
  fontSize: '12px',
  lineHeight: 1.3,
  fontWeight: 700,
  textTransform: 'uppercase',
})

const metricValueStyle = css({
  margin: '4px 0 0',
  color: '#f6f8fb',
  fontSize: '24px',
  lineHeight: 1,
  fontWeight: 760,
})

const panelStyle = css({
  minWidth: 0,
  border: '1px solid #283442',
  borderRadius: '8px',
  background: '#151c23',
  overflow: 'hidden',
})

const operationsGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 320px',
  gap: '18px',
  alignItems: 'start',
  '@media (max-width: 1120px)': {
    gridTemplateColumns: '1fr',
  },
})

const panelHeaderStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '18px 20px',
  borderBottom: '1px solid #283442',
})

const sectionTitleStyle = css({
  margin: 0,
  color: '#f6f8fb',
  fontSize: '18px',
  lineHeight: 1.25,
  fontWeight: 730,
  letterSpacing: 0,
})

const sectionCopyStyle = css({
  margin: '4px 0 0',
  color: '#8996a5',
  fontSize: '13px',
  lineHeight: 1.45,
})

const tableWrapStyle = css({
  overflowX: 'auto',
})

const tableStyle = css({
  width: '100%',
  minWidth: '820px',
  borderCollapse: 'collapse',
  color: '#d7dee7',
  fontSize: '13px',
  lineHeight: 1.4,
  '& th': {
    padding: '10px 12px',
    color: '#8996a5',
    borderBottom: '1px solid #283442',
    fontSize: '12px',
    lineHeight: 1.3,
    fontWeight: 760,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  '& td': {
    padding: '13px 12px',
    borderBottom: '1px solid #222d38',
    verticalAlign: 'middle',
  },
  '& tbody tr:last-child td': {
    borderBottom: 0,
  },
})

const agentNameStyle = css({
  display: 'block',
  color: '#f6f8fb',
  fontWeight: 720,
})

const agentMetaStyle = css({
  display: 'block',
  marginTop: '2px',
  color: '#8996a5',
  fontSize: '12px',
})

const monoCellStyle = css({
  color: '#b9c5d2',
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  fontSize: '13px',
})

const badgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '24px',
  border: '1px solid',
  borderRadius: '999px',
  padding: '3px 9px',
  fontSize: '12px',
  fontWeight: 760,
  lineHeight: 1,
  textTransform: 'capitalize',
})

const rowActionsStyle = css({
  display: 'flex',
  gap: '6px',
})

const tableActionStyle = css({
  minHeight: '28px',
  border: '1px solid #344151',
  borderRadius: '6px',
  padding: '0 8px',
  background: '#111820',
  color: '#d7dee7',
  font: 'inherit',
  fontSize: '12px',
  fontWeight: 720,
  cursor: 'pointer',
  '&:hover, &:focus-visible': {
    borderColor: '#4f8cff',
    color: '#ffffff',
    outline: 'none',
  },
})

const railStyle = css({
  display: 'grid',
  gap: '18px',
  border: '1px solid #283442',
  borderRadius: '8px',
  background: '#151c23',
  padding: '18px',
})

const detailListStyle = css({
  display: 'grid',
  gap: '10px',
  margin: 0,
})

const detailStyle = css({
  display: 'grid',
  gap: '3px',
  '& dt': {
    color: '#8996a5',
    fontSize: '12px',
    fontWeight: 740,
    textTransform: 'uppercase',
  },
  '& dd': {
    margin: 0,
    color: '#f6f8fb',
    fontSize: '14px',
    lineHeight: 1.35,
  },
})

const monoDetailValueStyle = css({
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  fontSize: '13px',
})

const commandGridStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
})

const primaryCommandStyle = css({
  gridColumn: '1 / -1',
  minHeight: '38px',
  border: 0,
  borderRadius: '6px',
  background: '#4f8cff',
  color: '#ffffff',
  font: 'inherit',
  fontSize: '13px',
  fontWeight: 760,
  cursor: 'pointer',
  '&:hover, &:focus-visible': {
    background: '#2f73f5',
    outline: 'none',
  },
})

const secondaryCommandStyle = css({
  minHeight: '36px',
  border: '1px solid #354253',
  borderRadius: '6px',
  background: '#10161c',
  color: '#d7dee7',
  font: 'inherit',
  fontSize: '13px',
  fontWeight: 740,
  cursor: 'pointer',
  '&:hover, &:focus-visible': {
    borderColor: '#4f8cff',
    color: '#ffffff',
    outline: 'none',
  },
})

const railSectionStyle = css({
  display: 'grid',
  gap: '10px',
})

const railTitleStyle = css({
  margin: 0,
  color: '#f6f8fb',
  fontSize: '14px',
  lineHeight: 1.3,
  fontWeight: 760,
})

const eventsStyle = css({
  display: 'grid',
  gap: '9px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '& li': {
    display: 'grid',
    gridTemplateColumns: '42px minmax(0, 1fr)',
    gap: '8px',
    color: '#c5cfda',
    fontSize: '13px',
    lineHeight: 1.35,
  },
  '& time': {
    color: '#8996a5',
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
    fontSize: '12px',
  },
})

const logStyle = css({
  margin: 0,
  overflowX: 'auto',
  border: '1px solid #283442',
  borderRadius: '6px',
  background: '#0d1318',
  padding: '12px',
  color: '#b9c5d2',
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  fontSize: '12px',
  lineHeight: 1.55,
})
