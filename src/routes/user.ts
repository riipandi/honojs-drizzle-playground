import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import UUID from 'pure-uuid'

import { db } from '../database'
import { User, userTable } from '../database/schema/user'
import { jsonResponse, throwResponse } from '../utils/response'

// HTTP request validation schema
const userRequest = z.object({
  firstName: z.string(),
  lastName: z.string(),
})

export const r = new Hono()

r.get('/', async (c) => {
  try {
    const allUsers: User[] = await db.select().from(userTable)
    return allUsers.length > 0
      ? c.json<User[]>(allUsers)
      : jsonResponse('No users found', undefined, 200)
  } catch (error: any) {
    return error instanceof Response
      ? throwResponse(error.status, error.statusText)
      : throwResponse(500, error.message)
  }
})

r.get('/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const user = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1)

    return user.length > 0 ? c.json<User>(user[0]) : jsonResponse('User not found', undefined, 200)
  } catch (error: any) {
    return error instanceof Response
      ? throwResponse(error.status, error.statusText)
      : throwResponse(500, error.message)
  }
})

r.post('/', zValidator('json', userRequest), async (c) => {
  const data = c.req.valid('json')
  const uuid = new UUID(1).toString()

  try {
    await db.insert(userTable).values({
      id: uuid,
      firstName: data.firstName,
      lastName: data.lastName,
    })

    return c.json({
      success: true,
      message: `User ${data.firstName} created`,
    })
  } catch (error: any) {
    return error instanceof Response
      ? throwResponse(error.status, error.statusText)
      : throwResponse(500, error.message)
  }
})

r.put('/:id', zValidator('json', userRequest), async (c) => {
  const id = c.req.param('id')
  const data = c.req.valid('json')

  try {
    await db.update(userTable).set(data).where(eq(userTable.id, id))

    return c.json({
      success: true,
      message: `User ${data.firstName} updated`,
    })
  } catch (error: any) {
    return error instanceof Response
      ? throwResponse(error.status, error.statusText)
      : throwResponse(500, error.message)
  }
})

r.delete('/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const user = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1)

    if (user.length === 0) {
      return throwResponse(400, 'User not found')
    }

    await db.delete(userTable).where(eq(userTable.id, id))

    return throwResponse(200, `User with id ${id} deleted`)
  } catch (error: any) {
    return error instanceof Response
      ? throwResponse(error.status, error.statusText)
      : throwResponse(500, error.message)
  }
})
