import { CalendarIcon } from "@phosphor-icons/react"

import { Field, FieldError, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"

import { dateFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { BaseProperties } from "./base-properties"
import { DateProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"
import { createDateFieldSchema } from "./validation"

type DateFieldInstance = ElementInstanceOf<"DateField">

const defaultAttributes: DateFieldInstance["extraAttributes"] = {
  label: "Date Picker",
  helperText: "",
  required: false,
  minDate: undefined,
  maxDate: undefined,
  customErrorMessage: "",
  disabled: false,
}

export const DateFieldFormElement: FormElement = {
  type: "DateField",
  construct: (id: string) => ({
    id: id,
    type: "DateField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: CalendarIcon,
    label: "Date Picker",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as DateFieldInstance
    const schema = createDateFieldSchema(element.extraAttributes)
    const result = schema.safeParse(currentValue ?? "")
    return result.success
  },
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as DateFieldInstance
  return (
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <CalendarIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.label || "Date Picker"}</span>
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
  const { extraAttributes } = elementInstance as DateFieldInstance

  return (
    <Field>
      <FieldLabel>
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>
      <Input
        type="date"
        defaultValue={defaultValue}
        aria-invalid={isInvalid}
        disabled={extraAttributes.disabled}
        min={extraAttributes.minDate}
        max={extraAttributes.maxDate}
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
  const element = elementInstance as DateFieldInstance
  const form = useElementForm(element, dateFieldAttributesSchema)

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
        hasPlaceholder={false}
        extraValidationSettings={
          <div className="grid grid-cols-2 gap-2">
            <form.Field name="minDate">
              {(field) => <DateProperty field={field} form={form} label="Min Date" />}
            </form.Field>
            <form.Field name="maxDate">
              {(field) => <DateProperty field={field} form={form} label="Max Date" />}
            </form.Field>
          </div>
        }
      />
    </Form>
  )
}
