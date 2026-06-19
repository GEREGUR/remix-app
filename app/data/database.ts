import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

import { createDatabase } from 'remix/data-table'
import { createMigrationRunner } from 'remix/data-table/migrations'
import { loadMigrations } from 'remix/data-table/migrations/node'
import { createSqliteDatabaseAdapter } from 'remix/data-table/sqlite'

const databasePath = path.resolve(process.env.SQLITE_DATABASE_PATH ?? 'db/app.sqlite')
const migrationsPath = path.resolve('db/migrations')

mkdirSync(path.dirname(databasePath), { recursive: true })

const sqlite = new DatabaseSync(databasePath)
sqlite.exec('PRAGMA foreign_keys = ON')

export const databaseAdapter = createSqliteDatabaseAdapter(sqlite)
export const db = createDatabase(databaseAdapter)

let migrationsReady: Promise<void> | undefined

export function migrateDatabase(): Promise<void> {
  migrationsReady ??= runMigrations()
  return migrationsReady
}

async function runMigrations(): Promise<void> {
  let migrations = await loadMigrations(migrationsPath)
  let runner = createMigrationRunner(databaseAdapter, migrations)
  await runner.up()
}
