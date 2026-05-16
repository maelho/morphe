import { Separator } from "@base-ui/react"
import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router"

import { AppSidebar } from "#/components/app-sidebar"
import { BuilderHeader } from "#/components/builder/builder-header"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "#/components/ui/sidebar"
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
  component: () => <App />,
})

function App() {
  const location = useLocation()
  const isBuilder =
    location.pathname.includes("/builder") || location.pathname.includes("/testbuilder")
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex min-h-0 flex-col overflow-hidden bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" />
          <div className="flex-1" />
          {isBuilder && <BuilderHeader />}
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
