import { FormContentSchema } from "./form-schemas"
import type { FormContent } from "./form-types"

export const parseFormContent = (raw: string): FormContent => {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error("Form content is not valid JSON")
  }

  const result = FormContentSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error(
      `Form content failed validation: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    )
  }

  return result.data
}

export const serializeFormContent = (content: FormContent): string => JSON.stringify(content)
