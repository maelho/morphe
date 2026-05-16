import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
})

export const githubSignIn = async () => {
  await authClient.signIn.social({
    provider: "github",
  })
}
