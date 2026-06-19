import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

let testDirectory = mkdtempSync(path.join(os.tmpdir(), 'finance-signup-'))
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
  assert.equal(postResponse.headers.get('location'), routes.home.href())
  assert.match(postResponse.headers.get('set-cookie') ?? '', /__finance_session=/)

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
