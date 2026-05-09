import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { authQueryOptions } from "#/integrations/better-auth/queries"

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    })

    if (!user) {
      throw redirect({ to: "/" })
    }

    return { user }
  },
  component: () => <Outlet />,
})
