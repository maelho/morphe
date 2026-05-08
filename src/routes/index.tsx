import { createFileRoute } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import BetterAuthHeader from "#/integrations/better-auth/header-user"
import { signIn } from "#/lib/auth-client"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <BetterAuthHeader />
      <Button onClick={signIn}>Login</Button>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
