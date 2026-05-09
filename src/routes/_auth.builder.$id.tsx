import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/builder/$id")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/builder/$id"!</div>
}
