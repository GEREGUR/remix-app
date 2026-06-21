import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'
import { theme } from 'remix/ui/theme'

import type { UserIdentity } from '../../data/schema.ts'
import {
  SacredBadge,
  SacredButton,
  SacredDataTable,
  SacredDetailList,
  SacredEventList,
  SacredMetric,
  SacredMetricGrid,
  SacredPanel,
  sacredInlineActionsStyle,
  sacredLogStyle,
  sacredMonoCellStyle,
  sacredStackStyle,
  type SacredDataRow,
  type SacredTone,
} from '../../ui/sacred.tsx'
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
    let agentRows = agents.map<SacredDataRow>((agent) => ({
      id: agent.id,
      cells: [
        <>
          <strong mix={agentNameStyle}>{agent.name}</strong>
          <span mix={agentMetaStyle}>{agent.host}</span>
        </>,
        <SacredBadge tone={statusTone(agent.status)}>{agent.status}</SacredBadge>,
        <span mix={sacredMonoCellStyle}>{agent.ref}</span>,
        agent.version,
        agent.cpu,
        agent.memory,
        agent.lastDeploy,
        <div mix={sacredInlineActionsStyle}>
          <SacredButton>Restart</SacredButton>
          <SacredButton>Deploy</SacredButton>
        </div>,
      ],
    }))

    return (
      <AdminShell user={user} active="dashboard" title="Dashboard">
        <main mix={pageStyle}>
          <header mix={headerStyle}>
            <div mix={titleBlockStyle}>
              <p mix={eyebrowStyle}>CONTROL PLANE</p>
              <h1 mix={titleStyle}>Agent operations</h1>
              <p mix={subtitleStyle}>Monitor deployed agents and queue controlled actions.</p>
            </div>

            <SacredMetricGrid>
              <SacredMetric label="Total" value={String(agents.length)} />
              <SacredMetric label="Running" value={String(running)} tone="success" />
              <SacredMetric label="Stopped" value={String(stopped)} tone="warning" />
              <SacredMetric label="Failed" value={String(failed)} tone="danger" />
            </SacredMetricGrid>
          </header>

          <div mix={operationsGridStyle}>
            <SacredPanel path="/agents" title="Managed agents" meta={`${agents.length} records`}>
              <SacredDataTable
                columns={[
                  { id: 'agent', label: 'Agent' },
                  { id: 'status', label: 'Status' },
                  { id: 'runtime-ref', label: 'Runtime ref' },
                  { id: 'version', label: 'Version' },
                  { id: 'cpu', label: 'CPU' },
                  { id: 'memory', label: 'Memory' },
                  { id: 'last-deploy', label: 'Last deploy' },
                  { id: 'actions', label: 'Actions' },
                ]}
                rows={agentRows}
              />
            </SacredPanel>

            <aside mix={sacredStackStyle}>
              <SacredPanel
                path="/selected"
                title={selectedAgent.name}
                copy="Selected agent operations and latest telemetry."
              >
                <div mix={railBodyStyle}>
                  <SacredDetailList
                    details={[
                      { label: 'Runtime', value: selectedAgent.runtime },
                      { label: 'Reference', value: selectedAgent.ref, mono: true },
                      { label: 'Version', value: selectedAgent.version },
                      { label: 'Host', value: selectedAgent.host },
                    ]}
                  />

                  <div mix={commandGridStyle} aria-label="Safe operations">
                    <SacredButton variant="primary">Restart</SacredButton>
                    <SacredButton>Stop</SacredButton>
                    <SacredButton>Deploy</SacredButton>
                  </div>
                </div>
              </SacredPanel>

              <section aria-labelledby="events-title" mix={railSectionStyle}>
                <h3 id="events-title" mix={railTitleStyle}>
                  Recent events
                </h3>
                <SacredEventList
                  events={[
                    { time: '12:42', text: 'Health check passed', tone: 'success' },
                    { time: '12:31', text: 'Restart requested by admin' },
                    { time: '12:26', text: 'Deploy 2026.06.18-4 completed' },
                  ]}
                />
              </section>

              <section aria-labelledby="logs-title" mix={railSectionStyle}>
                <h3 id="logs-title" mix={railTitleStyle}>
                  Log preview
                </h3>
                <pre mix={sacredLogStyle}>{`12:42:18 ready on port 7410
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

function statusTone(status: DashboardAgent['status']): SacredTone {
  if (status === 'running') return 'success'
  if (status === 'stopped') return 'warning'
  if (status === 'failed') return 'danger'
  return 'neutral'
}

const pageStyle = css({
  display: 'grid',
  gap: theme.space.xl,
})

const headerStyle = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(360px, auto)',
  alignItems: 'end',
  gap: theme.space.xl,
  '@media (max-width: 920px)': {
    gridTemplateColumns: '1fr',
    alignItems: 'start',
  },
})

const titleBlockStyle = css({
  minWidth: 0,
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

const titleStyle = css({
  color: theme.colors.text.primary,
  fontSize: theme.fontSize.xxl,
  fontWeight: theme.fontWeight.bold,
  letterSpacing: theme.letterSpacing.normal,
  lineHeight: theme.lineHeight.tight,
  '@media (max-width: 520px)': {
    fontSize: theme.fontSize.xl,
  },
})

const subtitleStyle = css({
  color: theme.colors.text.secondary,
  fontSize: theme.fontSize.sm,
  lineHeight: theme.lineHeight.normal,
})

const operationsGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 330px',
  gap: theme.space.lg,
  alignItems: 'start',
  '@media (max-width: 1120px)': {
    gridTemplateColumns: '1fr',
  },
})

const agentNameStyle = css({
  display: 'block',
  color: theme.colors.text.primary,
  fontWeight: theme.fontWeight.semibold,
})

const agentMetaStyle = css({
  display: 'block',
  marginTop: theme.space.xs,
  color: theme.colors.text.muted,
  fontSize: theme.fontSize.xxs,
})

const railBodyStyle = css({
  display: 'grid',
  gap: theme.space.lg,
  padding: theme.space.lg,
})

const commandGridStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.space.sm,
  '& button:first-child': {
    gridColumn: '1 / -1',
  },
})

const railSectionStyle = css({
  display: 'grid',
  gap: theme.space.sm,
})

const railTitleStyle = css({
  color: theme.colors.text.primary,
  fontSize: theme.fontSize.sm,
  fontWeight: theme.fontWeight.bold,
  lineHeight: theme.lineHeight.tight,
})
