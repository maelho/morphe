import { HashStraightIcon } from "@phosphor-icons/react"
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
import { FormNumberField } from "./form-number-field"
import { createNumberFieldSchema } from "./validation"

const numberFieldPropertiesSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
  helperText: z.string(),
  required: z.boolean(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
  customErrorMessage: z.string(),
  disabled: z.boolean(),
})

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
    <div className="w-full space-y-1">
      <Label className="text-sm font-medium">
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <Input
        type="number"
        placeholder={extraAttributes.placeholder}
        disabled
        className={extraAttributes.disabled ? "opacity-50" : ""}
      />
      {extraAttributes.min !== undefined || extraAttributes.max !== undefined ? (
        <p className="text-xs text-muted-foreground">
          Range: {extraAttributes.min ?? "−∞"} to {extraAttributes.max ?? "∞"}
        </p>
      ) : null}
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

  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: {
      onChange: numberFieldPropertiesSchema,
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
        <form.Field name="placeholder">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Placeholder</FieldLabel>
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
        <form.Field name="step">
          {(field) => (
            <FormNumberField
              label="Step"
              value={field.state.value ?? null}
              onValueChange={(value) => {
                field.handleChange(value ?? undefined)
                form.handleSubmit()
              }}
              min={1}
              description="Increment step value"
            />
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
          <form.Field name="min">
            {(field) => (
              <FormNumberField
                label="Min Value"
                value={field.state.value ?? null}
                onValueChange={(value) => {
                  field.handleChange(value ?? undefined)
                  form.handleSubmit()
                }}
              />
            )}
          </form.Field>

          <form.Field name="max">
            {(field) => (
              <FormNumberField
                label="Max Value"
                value={field.state.value ?? null}
                onValueChange={(value) => {
                  field.handleChange(value ?? undefined)
                  form.handleSubmit()
                }}
              />
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
                placeholder="e.g., Value must be between 1 and 100"
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
