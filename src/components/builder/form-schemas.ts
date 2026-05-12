import { z } from "zod"

import type { ElementsType } from "./form-types"

const colorSchema = z.string().regex(/^(#[0-9a-fA-F]{3,8}|rgb|hsl)/, {
  message: "Must be a valid CSS color",
})

export const namedPatternSchema = z.enum([
  "none",
  "email",
  "url",
  "phone",
  "postal",
  "alphanumeric",
  "digits",
  "custom",
])

const baseElementSchema = z.object({
  id: z.string(),
})

export const baseFieldAttributesSchema = z.object({
  label: z.string(),
  required: z.boolean(),
  helperText: z.string(),
  customErrorMessage: z.string(),
  disabled: z.boolean(),
})

const placeholderAttributesSchema = z.object({
  placeholder: z.string(),
})

const textValidationSchema = z.object({
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().nonnegative().optional(),
  pattern: namedPatternSchema.optional(),
  customPattern: z.string().optional(),
})

const textareaValidationSchema = z.object({
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().nonnegative().optional(),
  rows: z.number().int().positive().optional(),
})

const numberValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
})

const dateValidationSchema = z.object({
  minDate: z.iso.date().optional(),
  maxDate: z.iso.date().optional(),
})

export const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
})

const selectValidationSchema = z.object({
  options: z.array(selectOptionSchema),
  allowClear: z.boolean(),
  searchable: z.boolean(),
})

export const titleFieldAttributesSchema = z.object({
  title: z.string(),
  fontSize: z.enum(["sm", "md", "lg", "xl"]),
  fontWeight: z.enum(["normal", "medium", "bold"]),
  alignment: z.enum(["left", "center", "right"]),
  color: colorSchema.optional(),
})

export const subtitleFieldAttributesSchema = z.object({
  subtitle: z.string(),
  fontSize: z.enum(["sm", "md", "lg"]),
  fontWeight: z.enum(["normal", "medium"]),
  alignment: z.enum(["left", "center", "right"]),
  color: colorSchema.optional(),
})

export const paragraphFieldAttributesSchema = z.object({
  text: z.string(),
  fontSize: z.enum(["sm", "md", "lg"]),
  alignment: z.enum(["left", "center", "right"]),
  color: colorSchema.optional(),
})

export const separatorFieldAttributesSchema = z.object({
  thickness: z.number().int().positive(),
  style: z.enum(["solid", "dashed", "dotted"]),
  color: colorSchema.optional(),
})

export const textFieldAttributesSchema = baseFieldAttributesSchema
  .extend(placeholderAttributesSchema.shape)
  .extend(textValidationSchema.shape)

export const textareaFieldAttributesSchema = baseFieldAttributesSchema
  .extend(placeholderAttributesSchema.shape)
  .extend(textareaValidationSchema.shape)

export const numberFieldAttributesSchema = baseFieldAttributesSchema
  .extend(placeholderAttributesSchema.shape)
  .extend(numberValidationSchema.shape)

export const dateFieldAttributesSchema = baseFieldAttributesSchema.extend(
  dateValidationSchema.shape,
)

export const checkboxFieldAttributesSchema = baseFieldAttributesSchema

export const selectFieldAttributesSchema = baseFieldAttributesSchema
  .extend(placeholderAttributesSchema.shape)
  .extend(selectValidationSchema.shape)

export const spacerFieldAttributesSchema = z.object({ height: z.number().int().min(4).max(200) })

function element<T extends ElementsType, A extends z.ZodType>(type: T, extraAttributes: A) {
  return baseElementSchema.extend({
    type: z.literal(type),
    extraAttributes,
  })
}

const elementSchemas = {
  TitleField: element("TitleField", titleFieldAttributesSchema),
  SubtitleField: element("SubtitleField", subtitleFieldAttributesSchema),
  ParagraphField: element("ParagraphField", paragraphFieldAttributesSchema),
  TextField: element("TextField", textFieldAttributesSchema),
  TextareaField: element("TextareaField", textareaFieldAttributesSchema),
  NumberField: element("NumberField", numberFieldAttributesSchema),
  DateField: element("DateField", dateFieldAttributesSchema),
  CheckboxField: element("CheckboxField", checkboxFieldAttributesSchema),
  SelectField: element("SelectField", selectFieldAttributesSchema),
  SeparatorField: element("SeparatorField", separatorFieldAttributesSchema),
  SpacerField: element("SpacerField", spacerFieldAttributesSchema),
} satisfies { [K in ElementsType]: z.ZodType }

const elementSchemaValues = Object.values(elementSchemas) as [
  (typeof elementSchemas)[keyof typeof elementSchemas],
  ...(typeof elementSchemas)[keyof typeof elementSchemas][],
]

export const FormElementInstanceSchema = z.discriminatedUnion("type", elementSchemaValues)

export const FormContentSchema = z.array(FormElementInstanceSchema)

export type NamedPattern = z.infer<typeof namedPatternSchema>
export type SelectOption = z.infer<typeof selectOptionSchema>
