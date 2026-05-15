import { z } from "zod"

import type { FormElementInstance } from "../form-types"
import { getPatternValidator } from "./pattern-select"

type BaseStringAttrs = {
  required: boolean
  minLength?: number
  maxLength?: number
  customErrorMessage?: string
}

function buildStringSchema(attrs: BaseStringAttrs, defaultErrorMessage: string): z.ZodString {
  let schema = z.string()

  if (attrs.required) {
    schema = schema.min(1, {
      message: attrs.customErrorMessage || defaultErrorMessage,
    })
  }

  if (attrs.minLength !== undefined) {
    schema = schema.min(attrs.minLength, {
      message: attrs.customErrorMessage || `Minimum length is ${attrs.minLength}`,
    })
  }

  if (attrs.maxLength !== undefined) {
    schema = schema.max(attrs.maxLength, {
      message: attrs.customErrorMessage || `Maximum length is ${attrs.maxLength}`,
    })
  }

  return schema
}

export const createTextareaFieldSchema = (
  attrs: BaseStringAttrs,
  defaultErrorMessage = "This field is required",
): z.ZodString => buildStringSchema(attrs, defaultErrorMessage)

export const createTextFieldSchema = (
  attrs: BaseStringAttrs & {
    pattern?: string
    customPattern?: string
  },
  defaultErrorMessage = "This field is required",
): z.ZodString => {
  let schema = buildStringSchema(attrs, defaultErrorMessage)

  if (attrs.pattern && attrs.pattern !== "none") {
    const validator = getPatternValidator(attrs.pattern, attrs.customPattern)

    if (validator) {
      schema = schema.refine((val) => !val || validator.safeParse(val).success, {
        message: attrs.customErrorMessage || "Value does not match the required pattern",
      }) as any
    }
  }

  return schema
}

export const createNumberFieldSchema = (
  attrs: {
    required: boolean
    min?: number
    max?: number
    customErrorMessage?: string
  },
  defaultErrorMessage = "This field is required",
): z.ZodString => {
  let schema = z.string()

  if (attrs.required) {
    schema = schema.min(1, {
      message: attrs.customErrorMessage || defaultErrorMessage,
    })
  }

  schema = schema.refine(
    (val) => {
      if (!val || val.trim() === "") return true
      return !isNaN(Number(val))
    },
    {
      message: attrs.customErrorMessage || "Must be a valid number",
    },
  ) as any

  if (attrs.min !== undefined || attrs.max !== undefined) {
    schema = schema.refine(
      (val) => {
        if (!val || val.trim() === "") return true

        const num = Number(val)

        if (isNaN(num)) return false
        if (attrs.min !== undefined && num < attrs.min) return false
        if (attrs.max !== undefined && num > attrs.max) return false

        return true
      },
      {
        message:
          attrs.customErrorMessage ||
          `Value must be between ${attrs.min ?? "−∞"} and ${attrs.max ?? "∞"}`,
      },
    ) as any
  }

  return schema
}

export const createDateFieldSchema = (
  attrs: {
    required: boolean
    minDate?: string
    maxDate?: string
    customErrorMessage?: string
  },
  defaultErrorMessage = "This field is required",
): z.ZodString => {
  let schema = z.string()

  if (attrs.required) {
    schema = schema.min(1, {
      message: attrs.customErrorMessage || defaultErrorMessage,
    })
  }

  if (attrs.minDate || attrs.maxDate) {
    schema = schema.refine(
      (val) => {
        if (!val || val.trim() === "") return true

        const date = new Date(val)

        if (isNaN(date.getTime())) return false
        if (attrs.minDate && val < attrs.minDate) return false
        if (attrs.maxDate && val > attrs.maxDate) return false

        return true
      },
      {
        message:
          attrs.customErrorMessage ||
          `Date must be between ${attrs.minDate ?? "any"} and ${attrs.maxDate ?? "any"}`,
      },
    ) as any
  }

  return schema
}

export const createSelectFieldSchema = (
  attrs: {
    required: boolean
    customErrorMessage?: string
  },
  defaultErrorMessage = "Please select an option",
): z.ZodString => {
  let schema = z.string()

  if (attrs.required) {
    schema = schema.min(1, {
      message: attrs.customErrorMessage || defaultErrorMessage,
    })
  }

  return schema
}

/**
 * NEW
 */
export function getFieldSchema(element: FormElementInstance): z.ZodString {
  const extraAttributes = element.extraAttributes as Record<string, unknown>

  switch (element.type) {
    case "TextField":
      return createTextFieldSchema({
        required: (extraAttributes.required as boolean) ?? false,
        minLength: extraAttributes.minLength as number | undefined,
        maxLength: extraAttributes.maxLength as number | undefined,
        pattern: extraAttributes.pattern as string | undefined,
        customPattern: extraAttributes.customPattern as string | undefined,
        customErrorMessage: extraAttributes.customErrorMessage as string | undefined,
      })

    case "TextareaField":
      return createTextareaFieldSchema({
        required: (extraAttributes.required as boolean) ?? false,
        minLength: extraAttributes.minLength as number | undefined,
        maxLength: extraAttributes.maxLength as number | undefined,
        customErrorMessage: extraAttributes.customErrorMessage as string | undefined,
      })

    case "NumberField":
      return createNumberFieldSchema({
        required: (extraAttributes.required as boolean) ?? false,
        min: extraAttributes.min as number | undefined,
        max: extraAttributes.max as number | undefined,
        customErrorMessage: extraAttributes.customErrorMessage as string | undefined,
      })

    case "DateField":
      return createDateFieldSchema({
        required: (extraAttributes.required as boolean) ?? false,
        minDate: extraAttributes.minDate as string | undefined,
        maxDate: extraAttributes.maxDate as string | undefined,
        customErrorMessage: extraAttributes.customErrorMessage as string | undefined,
      })

    case "SelectField":
      return createSelectFieldSchema({
        required: (extraAttributes.required as boolean) ?? false,
        customErrorMessage: extraAttributes.customErrorMessage as string | undefined,
      })

    case "CheckboxField": {
      const isRequired = (extraAttributes.required as boolean) ?? false

      if (isRequired) {
        return z.string().refine((val) => val === "true", {
          message: (extraAttributes.customErrorMessage as string) || "This field is required",
        })
      }

      return z.string()
    }

    default:
      return z.string()
  }
}

export function buildFormSchema(
  elementOrder: string[],
  elements: Record<string, FormElementInstance>,
) {
  const shape: Record<string, z.ZodType> = {}

  for (const id of elementOrder) {
    const element = elements[id]

    if (!element) continue

    shape[id] = getFieldSchema(element)
  }

  return z.object(shape)
}
