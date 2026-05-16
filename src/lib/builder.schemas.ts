import z from "zod"

export const createFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().max(120),
})

export type CreateFormInput = z.infer<typeof createFormSchema>
