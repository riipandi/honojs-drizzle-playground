import { Hono } from 'hono'
import { db } from '../database'
import { User, userTable } from '../database/schema/user'
import { jsonResponse, throwResponse } from '../utils/response'

export const r = new Hono()

r.get('/', async (c) => {
  try {
    const allUsers: User[] = await db.select().from(userTable)
    // return allUsers.length > 0
    //   ? jsonResponse<User[]>(undefined, allUsers, 200)
    //   : jsonResponse('No users found', undefined, 200)

    return c.json<User[]>(allUsers)
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

r.post('/', (c) => c.text('Create user'))
