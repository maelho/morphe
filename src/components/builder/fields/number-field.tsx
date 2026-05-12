import { HashStraightIcon } from "@phosphor-icons/react"

import { Field, FieldError, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { Separator } from "#/components/ui/separator"

import { numberFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { StringProperty, SwitchProperty, NumberProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"
import { createNumberFieldSchema } from "./validation"

type NumberFieldInstance = ElementInstanceOf<"NumberField">

const defaultAttributes: NumberFieldInstance["extraAttributes"] = {
  label: "Number field",
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
    icon: HashStraightIcon,
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
      <HashStraightIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.label || "Number field"}</span>
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
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <CollapsibleSection title="Basic Settings" defaultOpen>
        <form.Field name="label">
          {(field) => <StringProperty field={field} form={form} label="Label" />}
        </form.Field>
        <form.Field name="placeholder">
          {(field) => <StringProperty field={field} form={form} label="Placeholder" />}
        </form.Field>
        <form.Field name="helperText">
          {(field) => (
            <StringProperty
              field={field}
              form={form}
              label="Helper Text"
              description="Appears below the field"
            />
          )}
        </form.Field>
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
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Validation" defaultOpen>
        <form.Field name="required">
          {(field) => <SwitchProperty field={field} form={form} label="Required" />}
        </form.Field>

        <div className="grid grid-cols-2 gap-2">
          <form.Field name="min">
            {(field) => <NumberProperty field={field} form={form} label="Min Value" />}
          </form.Field>
          <form.Field name="max">
            {(field) => <NumberProperty field={field} form={form} label="Max Value" />}
          </form.Field>
        </div>

        <form.Field name="customErrorMessage">
          {(field) => (
            <StringProperty
              field={field}
              form={form}
              label="Custom Error Message"
              placeholder="e.g., Value must be between 1 and 100"
              description="Shows when validation fails"
            />
          )}
        </form.Field>
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Advanced">
        <form.Field name="disabled">
          {(field) => (
            <SwitchProperty
              field={field}
              form={form}
              label="Disabled"
              description="Prevent user interaction"
            />
          )}
        </form.Field>
      </CollapsibleSection>
    </Form>
  )
}
