import { defineConfig } from 'prisma/config'

import { postgresAdapter } from '@prisma/adapter-neon'

export default defineConfig({
  db: {
    url: process.env.DATABASE_URL,
    adapter: postgresAdapter(),
  },
})