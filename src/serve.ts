import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { etag } from 'hono/etag'

// Create new instance
const app = new Hono()

// Register global middlewares and default route
app.use('*', etag())
app.use('*', prettyJSON())

// Handle the error and return the customized Response.
app.onError((err, c) => c.json({ code: 500, message: err.message }, 500))
app.notFound((c) => c.json({ code: 404, message: 'Not Found' }, 404))

app.get('/', (c) => c.text('Hono meets Node.js'))

serve({
  fetch: app.fetch,
  port: 3000,
})