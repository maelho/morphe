import { z } from "zod"

import type { ElementsType, FormElementInstance } from "../form-types"
import { getPatternValidator } from "./pattern-select"

type BaseStringAttrs = {
  required: boolean
  minLength?: number
  maxLength?: number
  customErrorMessage?: string
}

const INPUT_FIELD_TYPES: ElementsType[] = [
  "TextField",
  "TextareaField",
  "NumberField",
  "DateField",
  "CheckboxField",
  "SelectField",
]

function preprocessString(value: unknown, required: boolean) {
  if (typeof value !== "string") {
    return value
  }

  const trimmed = value.trim()

  if (!required && trimmed === "") {
    return undefined
  }

  return trimmed
}

function buildStringSchema(attrs: BaseStringAttrs, defaultErrorMessage: string) {
  return z
    .preprocess(
      (value) => preprocessString(value, attrs.required),
      attrs.required ? z.string() : z.string().optional(),
    )
    .superRefine((value: string | undefined, ctx) => {
      if (value === undefined) {
        return
      }

      if (attrs.required && value.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: attrs.customErrorMessage || defaultErrorMessage,
        })

        return
      }

      if (attrs.minLength !== undefined && value.length < attrs.minLength) {
        ctx.addIssue({
          code: "too_small",
          minimum: attrs.minLength,
          inclusive: true,
          origin: "string",
          message: attrs.customErrorMessage || `Minimum length is ${attrs.minLength}`,
        })
      }

      if (attrs.maxLength !== undefined && value.length > attrs.maxLength) {
        ctx.addIssue({
          code: "too_big",
          maximum: attrs.maxLength,
          inclusive: true,
          origin: "string",
          message: attrs.customErrorMessage || `Maximum length is ${attrs.maxLength}`,
        })
      }
    })
}

export function createTextareaFieldSchema(
  attrs: BaseStringAttrs,
  defaultErrorMessage = "This field is required",
) {
  return buildStringSchema(attrs, defaultErrorMessage)
}

export function createTextFieldSchema(
  attrs: BaseStringAttrs & {
    pattern?: string
    customPattern?: string
  },
  defaultErrorMessage = "This field is required",
) {
  return buildStringSchema(attrs, defaultErrorMessage).superRefine(
    (value: string | undefined, ctx) => {
      if (value === undefined || value === "") {
        return
      }

      if (!attrs.pattern || attrs.pattern === "none") {
        return
      }

      const validator = getPatternValidator(attrs.pattern, attrs.customPattern)

      if (!validator) {
        return
      }

      const result = validator.safeParse(value)

      if (!result.success) {
        ctx.addIssue({
          code: "custom",
          message: attrs.customErrorMessage || result.error.issues[0]?.message || "Invalid value",
        })
      }
    },
  )
}

export function createNumberFieldSchema(attrs: {
  required: boolean
  min?: number
  max?: number
  customErrorMessage?: string
}) {
  return z
    .preprocess(
      (value) => preprocessString(value, attrs.required),
      attrs.required ? z.string() : z.string().optional(),
    )
    .superRefine((value: string | undefined, ctx) => {
      if (value === undefined) {
        return
      }

      if (value.length === 0) {
        if (attrs.required) {
          ctx.addIssue({
            code: "custom",
            message: attrs.customErrorMessage || "This field is required",
          })
        }

        return
      }

      const num = Number(value)

      if (Number.isNaN(num)) {
        ctx.addIssue({
          code: "custom",
          message: attrs.customErrorMessage || "Must be a valid number",
        })

        return
      }

      if (attrs.min !== undefined && num < attrs.min) {
        ctx.addIssue({
          code: "custom",
          message:
            attrs.customErrorMessage || `Value must be greater than or equal to ${attrs.min}`,
        })

        return
      }

      if (attrs.max !== undefined && num > attrs.max) {
        ctx.addIssue({
          code: "custom",
          message: attrs.customErrorMessage || `Value must be less than or equal to ${attrs.max}`,
        })
      }
    })
}

export function createDateFieldSchema(attrs: {
  required: boolean
  minDate?: string
  maxDate?: string
  customErrorMessage?: string
}) {
  function parseLocalDate(dateString: string) {
    return new Date(`${dateString}T00:00:00`)
  }

  return z
    .preprocess(
      (value) => preprocessString(value, attrs.required),
      attrs.required ? z.string() : z.string().optional(),
    )
    .superRefine((value: string | undefined, ctx) => {
      if (value === undefined) {
        return
      }

      const currentDate = parseLocalDate(value)

      if (Number.isNaN(currentDate.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: attrs.customErrorMessage || "Invalid date",
        })

        return
      }

      if (attrs.minDate) {
        const minDate = parseLocalDate(attrs.minDate)

        if (currentDate.getTime() < minDate.getTime()) {
          ctx.addIssue({
            code: "custom",
            message: attrs.customErrorMessage || `Date must be after ${attrs.minDate}`,
          })
        }
      }

      if (attrs.maxDate) {
        const maxDate = parseLocalDate(attrs.maxDate)

        if (currentDate.getTime() > maxDate.getTime()) {
          ctx.addIssue({
            code: "custom",
            message: attrs.customErrorMessage || `Date must be before ${attrs.maxDate}`,
          })
        }
      }
    })
}

export function createSelectFieldSchema(
  attrs: {
    required: boolean
    customErrorMessage?: string
  },
  defaultErrorMessage = "Please select an option",
) {
  return z
    .preprocess(
      (value) => preprocessString(value, attrs.required),
      attrs.required ? z.string() : z.string().optional(),
    )
    .superRefine((value: string | undefined, ctx) => {
      if (value === undefined) {
        return
      }

      if (attrs.required && value.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: attrs.customErrorMessage || defaultErrorMessage,
        })
      }
    })
}

export function createCheckboxFieldSchema(attrs: {
  required: boolean
  customErrorMessage?: string
}) {
  return z.boolean().refine(
    (value) => {
      if (!attrs.required) {
        return true
      }

      return value === true
    },
    {
      message: attrs.customErrorMessage || "This field is required",
    },
  )
}

export function getFieldSchema(element: FormElementInstance) {
  switch (element.type) {
    case "TextField":
      return createTextFieldSchema({
        required: element.extraAttributes.required ?? false,
        minLength: element.extraAttributes.minLength,
        maxLength: element.extraAttributes.maxLength,
        pattern: element.extraAttributes.pattern,
        customPattern: element.extraAttributes.customPattern,
        customErrorMessage: element.extraAttributes.customErrorMessage,
      })

    case "TextareaField":
      return createTextareaFieldSchema({
        required: element.extraAttributes.required ?? false,
        minLength: element.extraAttributes.minLength,
        maxLength: element.extraAttributes.maxLength,
        customErrorMessage: element.extraAttributes.customErrorMessage,
      })

    case "NumberField":
      return createNumberFieldSchema({
        required: element.extraAttributes.required ?? false,
        min: element.extraAttributes.min,
        max: element.extraAttributes.max,
        customErrorMessage: element.extraAttributes.customErrorMessage,
      })

    case "DateField":
      return createDateFieldSchema({
        required: element.extraAttributes.required ?? false,
        minDate: element.extraAttributes.minDate,
        maxDate: element.extraAttributes.maxDate,
        customErrorMessage: element.extraAttributes.customErrorMessage,
      })

    case "SelectField":
      return createSelectFieldSchema({
        required: element.extraAttributes.required ?? false,
        customErrorMessage: element.extraAttributes.customErrorMessage,
      })

    case "CheckboxField":
      return createCheckboxFieldSchema({
        required: element.extraAttributes.required ?? false,
        customErrorMessage: element.extraAttributes.customErrorMessage,
      })

    default:
      return z.any()
  }
}

export function buildFormSchema(
  elementOrder: string[],
  elements: Record<string, FormElementInstance>,
) {
  const shape: Record<string, z.ZodType> = {}

  for (const id of elementOrder) {
    const element = elements[id]

    if (!element) {
      continue
    }

    if (!INPUT_FIELD_TYPES.includes(element.type)) {
      continue
    }

    shape[id] = getFieldSchema(element)
  }

  return z.object(shape)
}
