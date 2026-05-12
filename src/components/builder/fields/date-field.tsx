import { CalendarBlankIcon } from "@phosphor-icons/react"

import { Field, FieldError, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { Separator } from "#/components/ui/separator"

import { dateFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { StringProperty, SwitchProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"
import { createDateFieldSchema } from "./validation"

type DateFieldInstance = ElementInstanceOf<"DateField">

const defaultAttributes: DateFieldInstance["extraAttributes"] = {
  label: "Date field",
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
    icon: CalendarBlankIcon,
    label: "Date",
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
      <CalendarBlankIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.label || "Date field"}</span>
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
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Validation" defaultOpen>
        <form.Field name="required">
          {(field) => <SwitchProperty field={field} form={form} label="Required" />}
        </form.Field>

        <div className="grid grid-cols-2 gap-2">
          <form.Field name="minDate">
            {(field) => (
              <Field name={field.name}>
                <FieldLabel>Min Date</FieldLabel>
                <Input
                  type="date"
                  value={(field.state.value as string) || ""}
                  onBlur={() => {
                    field.handleBlur()
                    form.handleSubmit()
                  }}
                  onChange={(e) => field.handleChange(e.target.value || undefined)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="maxDate">
            {(field) => (
              <Field name={field.name}>
                <FieldLabel>Max Date</FieldLabel>
                <Input
                  type="date"
                  value={(field.state.value as string) || ""}
                  onBlur={() => {
                    field.handleBlur()
                    form.handleSubmit()
                  }}
                  onChange={(e) => field.handleChange(e.target.value || undefined)}
                />
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="customErrorMessage">
          {(field) => (
            <StringProperty
              field={field}
              form={form}
              label="Custom Error Message"
              placeholder="e.g., Please select a valid date"
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
