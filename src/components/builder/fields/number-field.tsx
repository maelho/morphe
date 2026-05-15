import { HashIcon } from "@phosphor-icons/react"

import { Field, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "#/components/ui/number-field"

import { numberFieldAttributesSchema } from "../form-schemas"
import type {
  ElementInstanceOf,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../form-types"
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
    <div className="flex w-full flex-col gap-2 py-1">
      <span className="text-sm font-medium text-foreground">
        {extraAttributes.label || "Number"}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </span>
      <NumberField
        min={extraAttributes.min}
        max={extraAttributes.max}
        step={extraAttributes.step}
        disabled={extraAttributes.disabled}
      >
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput
            placeholder={extraAttributes.placeholder}
            className="text-sm text-muted-foreground/60"
          />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      {extraAttributes.helperText && (
        <span className="text-xs text-muted-foreground">{extraAttributes.helperText}</span>
      )}
    </div>
  )
}

function FormComponent({
  elementInstance,
  isInvalid,
  value,
  submitValue,
}: {
  elementInstance: FormElementInstance
  isInvalid?: boolean
  value?: string
  submitValue?: SubmitFunction
}) {
  const { extraAttributes } = elementInstance as NumberFieldInstance

  const parsedValue = value !== undefined && value !== "" ? parseFloat(value) : null

  const elementId = elementInstance.id

  const handleChange = (newValue: number | null) => {
    submitValue?.(elementId, newValue?.toString() ?? "")
  }

  return (
    <Field>
      <FieldLabel>
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>

      <NumberField
        value={parsedValue}
        min={extraAttributes.min}
        max={extraAttributes.max}
        step={extraAttributes.step}
        disabled={extraAttributes.disabled}
        onValueChange={handleChange}
      >
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput placeholder={extraAttributes.placeholder} />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>

      {extraAttributes.helperText && (
        <FieldDescription>{extraAttributes.helperText}</FieldDescription>
      )}
      {isInvalid && (
        <span className="text-xs text-destructive-foreground">
          {extraAttributes.customErrorMessage || "This field is required"}
        </span>
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
