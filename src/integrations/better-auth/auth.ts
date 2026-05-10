import { betterAuth } from "better-auth"
import "@tanstack/react-start/server-only"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import { prisma } from "#/db"

export const auth = betterAuth({
  telemetry: {
    enabled: false,
  },
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [tanstackStartCookies()],
})
