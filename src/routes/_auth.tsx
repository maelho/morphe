import { Separator } from "@base-ui/react"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { AppSidebar } from "#/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "#/components/ui/sidebar"

// import { authQueryOptions } from "#/integrations/better-auth/queries"

export const Route = createFileRoute("/_auth")({
  // beforeLoad: async ({ context }) => {
  //   const user = await context.queryClient.ensureQueryData({
  //     ...authQueryOptions(),
  //     revalidateIfStale: true,
  //   })

  //   if (!user) {
  //     throw redirect({ to: "/" })
  //   }

  //   return { user }
  // },
  component: () => <App />,
})

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" />
        </header>
        <div className="">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
