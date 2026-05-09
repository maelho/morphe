import { GithubLogoIcon } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { githubSignIn } from "#/integrations/better-auth/auth-client"
import { authQueryOptions } from "#/integrations/better-auth/queries"

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    })
    if (user) {
      throw redirect({
        to: "/dashboard",
      })
    }
  },
  component: Home,
})

function Home() {
  const mutation = useMutation({
    mutationFn: async () => await githubSignIn(),
  })

  return (
    <div className="p-8">
      <Button size="icon" onClick={() => mutation.mutate()}>
        <GithubLogoIcon />
      </Button>
    </div>
  )
}
