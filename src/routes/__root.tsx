import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

import { AnchoredToastProvider, ToastProvider } from "#/components/ui/toast"
import type { AuthQueryResult } from "#/integrations/better-auth/queries"
import TanStackQueryDevtools from "#/integrations/tanstack-query/devtools"
import { ThemeProvider } from "@/components/theme-provider"

import appCss from "../styles.css?url"

interface MyRouterContext {
  queryClient: QueryClient
  user: AuthQueryResult
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="relative">
        <div className="relative isolate flex min-h-svh flex-col">
          <ThemeProvider>
            <ToastProvider position="bottom-right">
              <AnchoredToastProvider>{children}</AnchoredToastProvider>
            </ToastProvider>
          </ThemeProvider>
        </div>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
