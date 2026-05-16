import { createServerFn } from "@tanstack/react-start"

import { freshAuthMiddleware } from "#/integrations/better-auth/middleware"

import { createFormSchema } from "./builder.schemas"
import { createNewForm } from "./builder.server"

export const createForm = createServerFn({ method: "POST" })
  .middleware([freshAuthMiddleware])
  .inputValidator(createFormSchema)
  .handler(async ({ data, context }) => {
    return createNewForm({
      name: data.name,
      description: data.description || "",
      userId: context.user.id,
    })
  })
