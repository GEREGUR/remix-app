import { mkdtempSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import * as assert from 'remix/assert'
import { test } from 'remix/test'

let testDirectory = mkdtempSync(path.join(os.tmpdir(), 'agent-admin-signup-'))
process.env.SQLITE_DATABASE_PATH = path.join(testDirectory, 'app.sqlite')
process.env.SESSION_SECRET = 'test-session-secret'

const [{ router }, { routes }, { db }, { users }] = await Promise.all([
  import('../../../router.ts'),
  import('../../../routes.ts'),
  import('../../../data/database.ts'),
  import('../../../data/schema.ts'),
])

test('signup creates a user and starts an auth session', async () => {
  let getResponse = await router.fetch(new Request(`http://localhost${routes.auth.signup.index.href()}`))
  assert.equal(getResponse.status, 200)

  let formData = new URLSearchParams({
    name: 'Ada Lovelace',
    email: 'Ada@Example.com',
    password: 'correct horse battery staple',
  })

  let postResponse = await router.fetch(
    new Request(`http://localhost${routes.auth.signup.action.href()}`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: formData,
    }),
  )

  assert.equal(postResponse.status, 303)
  assert.equal(postResponse.headers.get('location'), routes.dashboard.href())
  assert.match(postResponse.headers.get('set-cookie') ?? '', /__agent_admin_session=/)

  let user = await db.findOne(users, { where: { email: 'ada@example.com' } })
  assert.ok(user)
  assert.equal(user.name, 'Ada Lovelace')
  assert.notEqual(user.password_hash, 'correct horse battery staple')
  assert.match(user.password_hash, /^scrypt\$/)
})

test('signup rejects duplicate emails', async () => {
  let formData = new URLSearchParams({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'correct horse battery staple',
  })

  let response = await router.fetch(
    new Request(`http://localhost${routes.auth.signup.action.href()}`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: formData,
    }),
  )

  assert.equal(response.status, 409)
})

test('dashboard redirects anonymous users to login', async () => {
  let response = await router.fetch(new Request(`http://localhost${routes.dashboard.href()}`))

  assert.equal(response.status, 302)
  assert.equal(response.headers.get('location'), routes.auth.login.index.href())
})

test('login starts an auth session and renders the dashboard', async () => {
  let formData = new URLSearchParams({
    email: 'ada@example.com',
    password: 'correct horse battery staple',
  })

  let loginResponse = await router.fetch(
    new Request(`http://localhost${routes.auth.login.action.href()}`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: formData,
    }),
  )

  assert.equal(loginResponse.status, 303)
  assert.equal(loginResponse.headers.get('location'), routes.dashboard.href())

  let cookie = extractSessionCookie(loginResponse)
  assert.match(cookie, /__agent_admin_session=/)

  let dashboardResponse = await router.fetch(
    new Request(`http://localhost${routes.dashboard.href()}`, {
      headers: { cookie },
    }),
  )

  assert.equal(dashboardResponse.status, 200)
  assert.match(await dashboardResponse.text(), /Agent control plane/)
})

test('logout destroys the auth session', async () => {
  let formData = new URLSearchParams({
    email: 'ada@example.com',
    password: 'correct horse battery staple',
  })

  let loginResponse = await router.fetch(
    new Request(`http://localhost${routes.auth.login.action.href()}`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: formData,
    }),
  )

  let cookie = extractSessionCookie(loginResponse)

  let logoutResponse = await router.fetch(
    new Request(`http://localhost${routes.auth.logout.action.href()}`, {
      method: 'POST',
      headers: { cookie },
    }),
  )

  assert.equal(logoutResponse.status, 303)
  assert.equal(logoutResponse.headers.get('location'), routes.auth.login.index.href())

  let loggedOutCookie = extractSessionCookie(logoutResponse)
  let dashboardResponse = await router.fetch(
    new Request(`http://localhost${routes.dashboard.href()}`, {
      headers: { cookie: loggedOutCookie },
    }),
  )

  assert.equal(dashboardResponse.status, 302)
  assert.equal(dashboardResponse.headers.get('location'), routes.auth.login.index.href())
})

function extractSessionCookie(response: Response): string {
  let setCookie = response.headers.get('set-cookie') ?? ''
  let match = setCookie.match(/__agent_admin_session=[^;]*/)

  assert.ok(match, 'Expected session cookie in response')
  return match[0]
}
