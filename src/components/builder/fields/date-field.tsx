import { CalendarBlankIcon } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form-start"
import { useEffect } from "react"
import z from "zod"

import { Field, FieldError, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { Separator } from "#/components/ui/separator"
import { Switch } from "#/components/ui/switch"

import { designerStoreActions } from "../designer/store"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { createDateFieldSchema } from "./validation"

const dateFieldPropertiesSchema = z.object({
  label: z.string(),
  helperText: z.string(),
  required: z.boolean(),
  minDate: z.iso.date().optional(),
  maxDate: z.iso.date().optional(),
  customErrorMessage: z.string(),
  disabled: z.boolean(),
})

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
    <div className="w-full space-y-1">
      <Label className="text-sm font-medium">
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <Input type="date" disabled className={extraAttributes.disabled ? "opacity-50" : ""} />
      {(extraAttributes.minDate || extraAttributes.maxDate) && (
        <p className="text-xs text-muted-foreground">
          {extraAttributes.minDate && `Min: ${extraAttributes.minDate}`}
          {extraAttributes.minDate && extraAttributes.maxDate && " | "}
          {extraAttributes.maxDate && `Max: ${extraAttributes.maxDate}`}
        </p>
      )}
      {extraAttributes.disabled && <p className="text-xs text-muted-foreground">Disabled</p>}
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

  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: {
      onChange: dateFieldPropertiesSchema,
    },
    onSubmit: async ({ value }) => {
      designerStoreActions.updateElement(element.id, { ...element, extraAttributes: value })
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

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
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Label</FieldLabel>
              <Input
                value={field.state.value}
                onBlur={() => {
                  field.handleBlur()
                  form.handleSubmit()
                }}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="helperText">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Helper Text</FieldLabel>
              <Input
                value={field.state.value}
                onBlur={() => {
                  field.handleBlur()
                  form.handleSubmit()
                }}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Appears below the field</FieldDescription>
            </Field>
          )}
        </form.Field>
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Validation" defaultOpen>
        <form.Field name="required">
          {(field) => (
            <Field name={field.name}>
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0!">Required</FieldLabel>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked)
                    form.handleSubmit()
                  }}
                />
              </div>
            </Field>
          )}
        </form.Field>

        <div className="grid grid-cols-2 gap-2">
          <form.Field name="minDate">
            {(field) => (
              <Field name={field.name}>
                <FieldLabel>Min Date</FieldLabel>
                <Input
                  type="date"
                  value={field.state.value || ""}
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
                  value={field.state.value || ""}
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
            <Field name={field.name}>
              <FieldLabel>Custom Error Message</FieldLabel>
              <Input
                value={field.state.value || ""}
                onBlur={() => {
                  field.handleBlur()
                  form.handleSubmit()
                }}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g., Please select a valid date"
              />
              <FieldDescription>Shows when validation fails</FieldDescription>
            </Field>
          )}
        </form.Field>
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Advanced">
        <form.Field name="disabled">
          {(field) => (
            <Field name={field.name}>
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0!">Disabled</FieldLabel>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked)
                    form.handleSubmit()
                  }}
                />
              </div>
              <FieldDescription>Prevent user interaction</FieldDescription>
            </Field>
          )}
        </form.Field>
      </CollapsibleSection>
    </Form>
  )
}
