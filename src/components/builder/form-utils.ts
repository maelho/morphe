import { FormContentSchema } from "./form-schemas"
import type { FormContent } from "./form-types"

export const parseFormContent = (raw: string): FormContent =>
  FormContentSchema.parse(JSON.parse(raw))

export const serializeFormContent = (content: FormContent): string => JSON.stringify(content)
