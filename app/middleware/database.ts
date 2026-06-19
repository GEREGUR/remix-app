import { Database, type Database as DatabaseValue } from 'remix/data-table'
import type { Middleware } from 'remix/router'

import { db, migrateDatabase } from '../data/database.ts'

export function loadDatabase(): Middleware<{ key: typeof Database; value: DatabaseValue }> {
  return async (context, next) => {
    await migrateDatabase()
    context.set(Database, db)
    return next()
  }
}
