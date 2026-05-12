import { z } from "zod"

import { getPatternValidator } from "./pattern-select"

function buildStringSchema(
  attrs: {
    required: boolean
    minLength?: number
    maxLength?: number
    customErrorMessage?: string
  },
  defaultErrorMessage: string,
): z.ZodString {
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
  attrs: {
    required: boolean
    minLength?: number
    maxLength?: number
    customErrorMessage?: string
  },
  defaultErrorMessage = "This field is required",
) => buildStringSchema(attrs, defaultErrorMessage)

export const createTextFieldSchema = (
  attrs: {
    required: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
    customPattern?: string
    customErrorMessage?: string
  },
  defaultErrorMessage = "This field is required",
) => {
  const schema = buildStringSchema(attrs, defaultErrorMessage)

  if (attrs.pattern && attrs.pattern !== "none") {
    const validator = getPatternValidator(attrs.pattern, attrs.customPattern)
    if (validator) {
      return schema.refine((val) => !val || validator.safeParse(val).success, {
        message: attrs.customErrorMessage || "Value does not match the required pattern",
      })
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
) => {
  let schema = z.string()

  if (attrs.required) {
    schema = schema.min(1, {
      message: attrs.customErrorMessage || defaultErrorMessage,
    })
  }

  if (attrs.min !== undefined || attrs.max !== undefined) {
    return schema.refine(
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
    )
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
) => {
  let schema = z.string()

  if (attrs.required) {
    schema = schema.min(1, {
      message: attrs.customErrorMessage || defaultErrorMessage,
    })
  }

  if (attrs.minDate || attrs.maxDate) {
    return schema.refine(
      (val) => {
        if (!val || val.trim() === "") return true
        if (isNaN(new Date(val).getTime())) return false
        if (attrs.minDate && val < attrs.minDate) return false
        if (attrs.maxDate && val > attrs.maxDate) return false
        return true
      },
      {
        message:
          attrs.customErrorMessage ||
          `Date must be between ${attrs.minDate ?? "any"} and ${attrs.maxDate ?? "any"}`,
      },
    )
  }

  return schema
}

export const createSelectFieldSchema = (
  attrs: {
    required: boolean
    customErrorMessage?: string
  },
  defaultErrorMessage = "Please select an option",
) => {
  let schema = z.string()

  if (attrs.required) {
    schema = schema.min(1, {
      message: attrs.customErrorMessage || defaultErrorMessage,
    })
  }

  return schema
}
