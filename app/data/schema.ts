import { column as c, table, type TableRow } from 'remix/data-table'

export const users = table({
  name: 'users',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    email: c.text().notNull().unique(),
    name: c.text().notNull(),
    password_hash: c.text().notNull(),
    created_at: c.integer().notNull(),
  },
})

export type User = TableRow<typeof users>

export type UserIdentity = Pick<User, 'id' | 'email' | 'name' | 'created_at'>

export function toUserIdentity(user: User): UserIdentity {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
  }
}
