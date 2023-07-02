import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { db } from '../database'
import { User, NewUser, userTable } from '../database/schema/user'
import { jsonResponse, throwResponse } from '../utils/response'

// HTTP request validation schema
const userRequest = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.number(),
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

r.get('/:id', (c) => {
  const id = c.req.param('id')
  return c.text('Get user: ' + id)
})

r.post('/', zValidator('json', userRequest), (c) => {
  const data = c.req.valid('json')
  return c.json({
    success: true,
    message: `${data.firstName} phone number is: ${data.phone}`,
  })
})
