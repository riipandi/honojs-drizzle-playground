import zennv from 'zennv'
import { z } from 'zod'

const env = zennv({
  dotenv: true,
  schema: z.object({
    PORT: z.number().default(3000),
    DATABASE_URL: z.string(),
  }),
})

export default env
