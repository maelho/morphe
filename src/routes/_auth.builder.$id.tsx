import { createFileRoute } from "@tanstack/react-router"

import Builder from "#/components/builder/builder"

export const Route = createFileRoute("/_auth/builder/$id")({
  component: RouteComponent,
})

const mockForm = {
  id: 1, // number, not string
  userId: "user_123",
  name: "Sample Form",
  description: "A mock form for testing TitleField",
  createdAt: new Date("2026-05-10T00:00:00.000Z"), // Date object
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
      },
    },
  ]),
  FormSubmissions: [
    {
      id: 1,
      formId: 1,
      createdAt: new Date("2026-05-10T00:00:00.000Z"),
      content: JSON.stringify([
        {
          id: "title_001",
          type: "TitleField",
          value: "User filled title",
        },
      ]),
    },
  ],
}

function RouteComponent() {
  return <Builder form={mockForm} />
}
