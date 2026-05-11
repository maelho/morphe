import type { ReactNode } from "react"

import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field"

interface FormFieldWrapperProps {
  label: string
  required?: boolean
  helperText?: string
  isInvalid?: boolean
  errorMessage?: string
  defaultErrorMessage?: string
  children: ReactNode
}

export function FormFieldWrapper({
  label,
  required,
  helperText,
  isInvalid,
  errorMessage,
  defaultErrorMessage = "This field is required",
  children,
}: FormFieldWrapperProps) {
  return (
    <Field>
      <FieldLabel>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>
      {children}
      {helperText && <FieldDescription>{helperText}</FieldDescription>}
      {isInvalid && <FieldError>{errorMessage || defaultErrorMessage}</FieldError>}
    </Field>
  )
}
