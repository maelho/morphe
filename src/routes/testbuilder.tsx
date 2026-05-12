import { createFileRoute } from "@tanstack/react-router"

import FormBuilder from "#/components/builder"
import type { Form } from "#/generated/prisma/client"

export const Route = createFileRoute("/testbuilder")({
  component: RouteComponent,
})
const mockForm: Form = {
  id: "clh1234567890abcdef",
  userId: "user_123",
  name: "Sample Form",
  description: "A mock form for testing TitleField",
  createdAt: new Date("2026-05-10T00:00:00.000Z"),
  published: false,
  visits: 0,
  submissions: 0,
  shareURL: "123e4567-e89b-12d3-a456-426614174000",
  content: JSON.stringify([
    {
      id: "title_001",
      type: "TitleField",
      extraAttributes: {
        title: "Welcome to the Mock Form",
        fontSize: "lg",
        fontWeight: "bold",
        alignment: "left",
      },
    },
  ]),
}

function RouteComponent() {
  return (
    <div className="h-dv">
      <FormBuilder form={mockForm} />
    </div>
  )
}
