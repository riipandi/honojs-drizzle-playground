import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import env from '../environment'

// Postgres client for migrations. For the built in migrate function with DDL
// migrations strongly encourage you to use max: 1 connection configuration.
export const migrationClient = postgres(env.DATABASE_URL, { max: 1 })

// Postgres client for queries.
export const dbClient = postgres(env.DATABASE_URL)

export const db: PostgresJsDatabase = drizzle(dbClient, {
  logger: process.env.NODE_ENV !== 'production',
})
