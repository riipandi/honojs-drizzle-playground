import zennv from 'zennv'
import { z } from 'zod'

const env = zennv({
  dotenv: true,
  schema: z.object({
    DATABASE_URL: z.string(),
  }),
})

export default env
