import { betterAuth } from "better-auth"
import { tanstackStartCookies } from "better-auth/tanstack-start"

export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [tanstackStartCookies()],
})
