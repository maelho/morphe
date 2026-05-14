import { TextIndentIcon } from "@phosphor-icons/react"

import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Textarea } from "#/components/ui/textarea"

import { textareaFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { BaseProperties } from "./base-properties"
import { NumberProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"
import { createTextareaFieldSchema } from "./validation"

type TextareaFieldInstance = ElementInstanceOf<"TextareaField">

const DEFAULT_ROWS = 4

const defaultAttributes: TextareaFieldInstance["extraAttributes"] = {
  label: "Long Text",
  placeholder: "Write your answer",
  helperText: "",
  required: false,
  minLength: undefined,
  maxLength: undefined,
  rows: DEFAULT_ROWS,
  customErrorMessage: "",
  disabled: false,
}

export const TextareaFieldFormElement: FormElement = {
  type: "TextareaField",
  construct: (id: string) => ({
    id,
    type: "TextareaField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: TextIndentIcon,
    label: "Long Text",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as TextareaFieldInstance
    const schema = createTextareaFieldSchema(element.extraAttributes)
    return schema.safeParse(currentValue ?? "").success
  },
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as TextareaFieldInstance
  return (
    <div className="flex w-full flex-col gap-2 py-1">
      <span className="text-sm font-medium text-foreground">
        {extraAttributes.label || "Long Text"}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </span>
      <div className="flex min-h-[64px] w-full items-start rounded-lg border border-border bg-muted/40 px-3 py-2">
        <span className="truncate text-sm text-muted-foreground/60">
          {extraAttributes.placeholder || "Write your answer…"}
        </span>
      </div>
      {extraAttributes.helperText && (
        <span className="text-xs text-muted-foreground">{extraAttributes.helperText}</span>
      )}
    </div>
  )
}

function FormComponent({
  elementInstance,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance
  isInvalid?: boolean
  defaultValue?: string
}) {
  const { extraAttributes } = elementInstance as TextareaFieldInstance

  return (
    <Field>
      <FieldLabel>
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>
      <Textarea
        placeholder={extraAttributes.placeholder}
        defaultValue={defaultValue}
        aria-invalid={isInvalid}
        disabled={extraAttributes.disabled}
        rows={extraAttributes.rows ?? DEFAULT_ROWS}
        maxLength={extraAttributes.maxLength}
      />
      {extraAttributes.helperText && (
        <FieldDescription>{extraAttributes.helperText}</FieldDescription>
      )}
      {isInvalid && (
        <FieldError>{extraAttributes.customErrorMessage || "This field is required"}</FieldError>
      )}
    </Field>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as TextareaFieldInstance
  const form = useElementForm(element, textareaFieldAttributesSchema)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <BaseProperties
        form={form}
        extraBasicSettings={
          <form.Field name="rows">
            {(field) => (
              <NumberProperty
                field={field}
                form={form}
                label="Rows"
                min={1}
                max={20}
                description="Number of visible text lines"
              />
            )}
          </form.Field>
        }
        extraValidationSettings={
          <div className="grid grid-cols-2 gap-2">
            <form.Field name="minLength">
              {(field) => <NumberProperty field={field} form={form} label="Min Length" min={0} />}
            </form.Field>
            <form.Field name="maxLength">
              {(field) => <NumberProperty field={field} form={form} label="Max Length" min={0} />}
            </form.Field>
          </div>
        }
      />
    </Form>
  )
}
