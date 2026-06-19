import { createController } from 'remix/router'
import { Auth } from 'remix/middleware/auth'
import { redirect } from 'remix/response/redirect'

import { assetServer } from '../assets.ts'
import { routes } from '../routes.ts'
import { DashboardPage } from './dashboard/page.tsx'

export default createController(routes, {
  actions: {
    async assets(context) {
      return (
        (await assetServer.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
      )
    },
    home(context) {
      let auth = context.get(Auth)
      return redirect(auth.ok ? routes.dashboard.href() : routes.auth.login.index.href())
    },
    dashboard(context) {
      let auth = context.get(Auth)

      if (!auth.ok) {
        return redirect(routes.auth.login.index.href())
      }

      return context.render(<DashboardPage user={auth.identity} agents={agents} />)
    },
  },
})

const agents = [
  {
    id: 'agent-api-main',
    name: 'API Orchestrator',
    runtime: 'systemd',
    ref: 'agent-api.service',
    status: 'running',
    host: 'eclipse-server',
    version: '2026.06.18-4',
    lastDeploy: '12 minutes ago',
    cpu: '3.8%',
    memory: '188 MB',
  },
  {
    id: 'agent-worker-index',
    name: 'Index Worker',
    runtime: 'systemd',
    ref: 'agent-index.service',
    status: 'running',
    host: 'eclipse-server',
    version: '2026.06.17-2',
    lastDeploy: '22 hours ago',
    cpu: '8.1%',
    memory: '412 MB',
  },
  {
    id: 'agent-research',
    name: 'Research Agent',
    runtime: 'systemd',
    ref: 'agent-research.service',
    status: 'stopped',
    host: 'eclipse-server',
    version: '2026.06.12-1',
    lastDeploy: '6 days ago',
    cpu: '0%',
    memory: '0 MB',
  },
  {
    id: 'agent-deploy',
    name: 'Deploy Sentinel',
    runtime: 'systemd',
    ref: 'agent-deploy.service',
    status: 'failed',
    host: 'eclipse-server',
    version: '2026.06.10-7',
    lastDeploy: '2 days ago',
    cpu: '0.4%',
    memory: '76 MB',
  },
] as const
