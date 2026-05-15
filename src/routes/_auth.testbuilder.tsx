import { createFileRoute } from "@tanstack/react-router"

import FormBuilder from "#/components/builder"
import type { Form } from "#/generated/prisma/client"

export const Route = createFileRoute("/_auth/testbuilder")({
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
      id: "phone-field",
      type: "TextField",
      extraAttributes: {
        label: "Phone Number",
        placeholder: "+1 (555) 000-0000",
        helperText: "International format",
        required: true,
        minLength: undefined,
        maxLength: undefined,
        pattern: "phone",
        customPattern: undefined,
        customErrorMessage: "Enter a valid phone number",
        disabled: false,
      },
    },
    {
      id: "age-field",
      type: "NumberField",
      extraAttributes: {
        label: "Age",
        placeholder: "Enter your age",
        helperText: "Must be 18-100",
        required: true,
        min: 18,
        max: 100,
        step: 1,
        customErrorMessage: "Age must be between 18 and 100",
        disabled: false,
      },
    },
    {
      id: "postal-field",
      type: "TextField",
      extraAttributes: {
        label: "Postal Code",
        placeholder: "12345",
        helperText: "5-digit format",
        required: true,
        minLength: undefined,
        maxLength: undefined,
        pattern: "postal",
        customPattern: undefined,
        customErrorMessage: "Enter a valid postal code",
        disabled: false,
      },
    },
  ]),
}

function RouteComponent() {
  return <FormBuilder form={mockForm} />
}
