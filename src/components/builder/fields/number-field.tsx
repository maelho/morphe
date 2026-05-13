import { HashIcon } from "@phosphor-icons/react"

import { Field, FieldError, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"

import { numberFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { BaseProperties } from "./base-properties"
import { NumberProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"
import { createNumberFieldSchema } from "./validation"

type NumberFieldInstance = ElementInstanceOf<"NumberField">

const defaultAttributes: NumberFieldInstance["extraAttributes"] = {
  label: "Number",
  placeholder: "0",
  helperText: "",
  required: false,
  min: undefined,
  max: undefined,
  step: undefined,
  customErrorMessage: "",
  disabled: false,
}

export const NumberFieldFormElement: FormElement = {
  type: "NumberField",
  construct: (id: string) => ({
    id: id,
    type: "NumberField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: HashIcon,
    label: "Number",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as NumberFieldInstance
    const schema = createNumberFieldSchema(element.extraAttributes)
    const result = schema.safeParse(currentValue ?? "")
    return result.success
  },
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as NumberFieldInstance
  return (
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <HashIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.label || "Number"}</span>
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
  const { extraAttributes } = elementInstance as NumberFieldInstance

  return (
    <Field>
      <FieldLabel>
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>
      <Input
        type="number"
        placeholder={extraAttributes.placeholder}
        defaultValue={defaultValue}
        aria-invalid={isInvalid}
        disabled={extraAttributes.disabled}
        min={extraAttributes.min}
        max={extraAttributes.max}
        step={extraAttributes.step}
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
  const element = elementInstance as NumberFieldInstance
  const form = useElementForm(element, numberFieldAttributesSchema)

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
          <form.Field name="step">
            {(field) => (
              <NumberProperty
                field={field}
                form={form}
                label="Step"
                min={1}
                description="Increment step value"
              />
            )}
          </form.Field>
        }
        extraValidationSettings={
          <div className="grid grid-cols-2 gap-2">
            <form.Field name="min">
              {(field) => <NumberProperty field={field} form={form} label="Min Value" />}
            </form.Field>
            <form.Field name="max">
              {(field) => <NumberProperty field={field} form={form} label="Max Value" />}
            </form.Field>
          </div>
        }
      />
    </Form>
  )
}
