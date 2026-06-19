# ExecPlan: VPS Agent Admin Panel

This plan uses the Build Web Apps spec-driven workflow: define the product surface, generate and accept the visual design spec, extract a design system from that spec, implement in slices, and verify rendered screens against the accepted concept before shipping.

## Goal

Build this Remix app into a private admin panel for managing deployed agents on a VPS.

The app should let the owner authenticate, view deployed agents, inspect health and logs, start/stop/restart agents, run controlled deploy actions, and review recent activity. It must be server-first, secure by default, and structured around the existing Remix 3 route/controller/middleware/data conventions.

## Current Baseline

The project already has:

- Remix 3 route contract in `app/routes.ts`.
- Controllers under `app/actions/`.
- Request middleware for static files, sessions, form data, database access, auth, and rendering.
- SQLite database setup and migrations under `db/migrations/`.
- A `users` table and signup flow.
- Shared document shell under `app/ui/`.

The scaffold home page is still starter content and should be replaced.

## Product Spec

Primary user: the VPS owner/admin.

Primary jobs:

- Log in securely.
- See all managed agents and their current state.
- Open an agent detail page with runtime status, deployment info, and recent events.
- View recent logs.
- Start, stop, and restart an agent through predefined safe actions.
- Trigger a controlled deploy.
- Edit agent metadata and runtime configuration.
- Review an audit trail of changes.

Non-goals for the first build:

- Multi-tenant user management.
- Public APIs for third-party control.
- Arbitrary shell command execution from the UI.
- Full real-time log streaming unless the server/runtime adapter is ready for it.
- Cross-VPS fleet management.

## Spec-Driven Gates

### Gate 1: Interaction And Information Spec

Define the exact app surfaces before implementation:

- Login screen.
- Dashboard overview.
- Agents list.
- Agent detail.
- Agent logs.
- Agent deploy action.
- Settings/account screen.
- Empty/error states for no agents, failed runtime lookup, failed deploy, and unavailable logs.

Acceptance:

- Routes, page purpose, visible controls, form fields, table columns, and state transitions are written down.
- All destructive or operational actions have confirmation/error/success behavior.
- No route exposes arbitrary commands.

### Gate 2: Visual Concept Spec

Use Image Gen through the Build Web Apps workflow before coding the main UI.

Required concepts:

- Full desktop dashboard screen.
- Desktop agent detail screen.
- Desktop logs/deploy state detail, if unreadable inside the detail screen.
- Mobile dashboard or agent list screen.

Visual direction:

- Quiet operational admin tool, not a marketing landing page.
- Dense enough for repeated work, but with clear status hierarchy.
- First screen should be the usable dashboard, not a hero page.
- No decorative card-heavy bento layout.
- Tables, sidebars, status rails, logs, and command areas should feel like production admin software.
- Use restrained colors with clear semantic status colors.

Acceptance:

- Concept images are readable and implementation-ready.
- The accepted design includes app chrome, navigation, table/list density, controls, status indicators, and key states.
- Any missing or unreadable complex region gets its own detail concept before coding.

### Gate 3: Design System Extraction

Extract implementation rules from the accepted concept:

- Color tokens: background, surface, elevated surface, border, text, muted text, accent, success, warning, danger, running, stopped, unknown.
- Typography: app title, page title, section title, table text, metadata text, controls, logs monospace.
- Layout: sidebar/header model, max widths, gutters, responsive collapse, content density.
- Components: buttons, icon buttons, nav items, status badges, tables, detail rows, forms, log viewer, event timeline, confirmation panels.
- Motion: only state-confirming transitions, respecting `prefers-reduced-motion`.

Acceptance:

- Shared cross-route UI goes in `app/ui/`.
- Route-local UI stays next to the owning controller until it is reused.
- No visual implementation starts without the extracted design system.

### Gate 4: Implementation Slices

Implement the app in vertical slices, starting with server-correct routes before browser enhancements.

Slice 1: Auth hardening

- Rename the session cookie from finance-specific naming to admin-specific naming.
- Add login and logout routes.
- Decide whether signup remains dev-only, invite-only, or removed.
- Protect all admin routes.

Slice 2: Admin shell and dashboard

- Replace scaffold home with redirect behavior.
- Authenticated users go to `/dashboard`.
- Anonymous users go to `/login`.
- Add shared admin shell UI.
- Add dashboard page with seed/dev data if runtime integration is not ready.

Slice 3: Agent persistence

- Add database tables and migrations for agents, deployments, and agent events.
- Add focused query modules under `app/data/`.
- Add router/controller tests for listing and creating agents.

Slice 4: Agents list and detail

- Add `/agents` list route.
- Add `/agents/:agentId` detail route.
- Validate all params and form data at the boundary.
- Return explicit 404, 400, 409, and redirect responses.

Slice 5: Runtime adapter boundary

- Add an `AgentRuntime` interface for status, logs, start, stop, restart, and deploy.
- Add a fake runtime for development/tests.
- Add one real adapter based on deployment reality: `systemd`, Docker, or SSH.
- Runtime refs must be allowlisted or validated, never raw commands from forms.

Slice 6: Operational actions

- Add start, stop, restart, and deploy form actions.
- Add audit events for every operational action.
- Add success and failure feedback.
- Add tests for authorization, validation, and expected runtime failures.

Slice 7: Logs

- Add agent logs route.
- Start with recent log fetch.
- Add polling or hydration only if needed after server-rendered logs work.

Slice 8: Verification and polish

- Run typecheck and tests.
- Run local app.
- Verify desktop and mobile in Browser/IAB.
- Compare implementation screenshots against accepted concepts with `view_image`.
- Fix visible drift until the rendered UI matches the accepted design spec.

## Proposed Route Contract

```ts
export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  auth: route({
    login: form('/login'),
    logout: form('/logout'),
    signup: form('/signup'),
  }),
  dashboard: get('/dashboard'),
  agents: route('/agents', {
    index: form('/'),
    detail: route('/:agentId', {
      index: form('/'),
      logs: get('/logs'),
      deploy: form('/deploy'),
      start: form('/start'),
      stop: form('/stop'),
      restart: form('/restart'),
    }),
  }),
  settings: form('/settings'),
})
```

## Proposed File Structure

```txt
app/
  actions/
    controller.tsx
    auth/
      login/
        controller.tsx
        page.tsx
      logout/
        controller.tsx
      signup/
        controller.tsx
        page.tsx
    dashboard/
      controller.tsx
      page.tsx
    agents/
      controller.tsx
      page.tsx
      detail/
        controller.tsx
        page.tsx
      logs/
        controller.tsx
        page.tsx
    settings/
      controller.tsx
      page.tsx
  data/
    database.ts
    schema.ts
    users.ts
    agents.ts
    deployments.ts
    agent-events.ts
  middleware/
    auth.ts
    database.ts
    render.tsx
    require-auth.ts
    runtime.ts
    session.ts
  services/
    agent-runtime.ts
    fake-agent-runtime.ts
    systemd-agent-runtime.ts
  ui/
    admin-shell.tsx
    document.tsx
    form-field.tsx
    nav.tsx
    status-badge.tsx
```

`app/services/` is intentionally narrow: it is only for external runtime side effects and adapter interfaces. It must not become a generic helper directory.

## Data Model

Initial tables:

- `users`: existing authentication identity.
- `agents`: configured managed agents.
- `deployments`: deployment attempts and results.
- `agent_events`: audit trail.

`agents` should store:

- `id`
- `name`
- `slug`
- `description`
- `runtime_type`
- `runtime_ref`
- `repo_url`
- `branch`
- `working_directory`
- `status_cache`
- `last_seen_at`
- `created_at`
- `updated_at`

Do not treat `status_cache` as the source of truth. Live status comes from the runtime adapter when available.

## Runtime Contract

```ts
export type AgentRuntime = {
  getStatus(agent: AgentRuntimeConfig): Promise<AgentStatus>
  start(agent: AgentRuntimeConfig): Promise<RuntimeResult>
  stop(agent: AgentRuntimeConfig): Promise<RuntimeResult>
  restart(agent: AgentRuntimeConfig): Promise<RuntimeResult>
  readLogs(agent: AgentRuntimeConfig, options: LogOptions): Promise<AgentLogChunk>
  deploy(agent: AgentRuntimeConfig): Promise<DeploymentResult>
}
```

Runtime rules:

- UI actions map to predefined runtime methods.
- Form input must never become a shell command.
- Runtime refs are validated against strict patterns or allowlists.
- All operational actions write audit events.
- Expected runtime failures become explicit HTTP responses and page states.

## Security Requirements

- Require `SESSION_SECRET` in production.
- Use hardened cookies: `httpOnly`, `sameSite`, secure in production.
- Regenerate session IDs on login/logout/privilege changes.
- Add CSRF protection before shipping operational form actions.
- Protect every admin controller explicitly.
- Authorize resource access inside handlers.
- Avoid CORS unless a specific same-owner external client requires it.
- Do not store VPS secrets in plain SQLite for the first version.

## Verification Plan

For each completed implementation slice:

- Run `npm test`.
- Run `npm run typecheck`.
- Exercise route behavior through router/controller tests.

For visual/admin UI completion:

- Start the local app.
- Verify in Browser/IAB first.
- Capture desktop and mobile screenshots.
- Use `view_image` on the accepted concept and latest implementation screenshot.
- Compare at least: copy, layout, typography, colors, spacing, table/log density, status colors, icon treatment, responsive behavior, and core interactions.
- Fix all material visual drift before final handoff.

## Open Decisions

- Are agents managed by `systemd`, Docker, PM2, plain shell scripts, or another supervisor?
- Will this panel run directly on the VPS or connect to the VPS over SSH?
- Should signup be removed, dev-only, or invite-only?
- Should logs be simple recent-log fetches, polling, or streamed?
- Should deploy mean `git pull && restart`, a script invocation, Docker image rollout, or something else?

## First Implementation Move

Do not start by wiring runtime commands.

Start by completing Gate 1 and Gate 2:

1. Write the route/page interaction spec.
2. Generate the dashboard and agent detail design concepts.
3. Accept or revise the concepts.
4. Extract the design system.
5. Then implement auth hardening and the admin shell as the first code slice.
