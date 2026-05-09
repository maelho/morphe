import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { authClient } from "#/integrations/better-auth/auth-client"
import { useAuthSuspense } from "#/integrations/better-auth/hooks"
import { authQueryOptions } from "#/integrations/better-auth/queries"

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuthSuspense()

  const queryClient = useQueryClient()
  const router = useRouter()
  return (
    <div>
      Hello "/_auth/dashboard"!
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Button
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onResponse: async () => {
                // manually set to null to avoid unnecessary refetching
                queryClient.setQueryData(authQueryOptions().queryKey, null)
                await router.invalidate()
              },
            },
          })
        }}
        type="button"
        variant="destructive"
      >
        Sign out
      </Button>
    </div>
  )
}
