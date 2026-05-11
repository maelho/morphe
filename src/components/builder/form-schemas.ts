import { z } from "zod"

import type { ElementsType } from "./form-types"

// const fieldAttributesSchema = z.object({
//   label: z.string(),
//   required: z.boolean(),
//   helperText: z.string(),
// })

// const withPlaceholderSchema = z.object({
//   placeholder: z.string(),
// })

const elementSchemas = {
  TitleField: z.object({
    id: z.string(),
    type: z.literal("TitleField"),
    extraAttributes: z.object({
      title: z.string(),
    }),
  }),

  // TextField: z.object({
  //   id: z.string(),
  //   type: z.literal("TextField"),
  //   extraAttributes: fieldAttributesSchema.extend(withPlaceholderSchema.shape),
  // }),

  // NumberField: z.object({
  //   id: z.string(),
  //   type: z.literal("NumberField"),
  //   extraAttributes: fieldAttributesSchema.extend(withPlaceholderSchema.shape),
  // }),

  // SelectField: z.object({
  //   id: z.string(),
  //   type: z.literal("SelectField"),
  //   extraAttributes: fieldAttributesSchema.extend({
  //     options: z.array(z.string()),
  //   }),
  // }),
} satisfies { [K in ElementsType]: z.ZodType }

export const FormElementInstanceSchema = z.discriminatedUnion("type", [
  elementSchemas.TitleField,
  // elementSchemas.TextField,
  // elementSchemas.NumberField,
  // elementSchemas.SelectField,
])

export const FormContentSchema = z.array(FormElementInstanceSchema)
