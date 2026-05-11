import { CheckSquareOffsetIcon } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form-start"
import { useEffect } from "react"
import z from "zod"

import { Checkbox } from "#/components/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { Separator } from "#/components/ui/separator"
import { Switch } from "#/components/ui/switch"

import { designerStoreActions } from "../designer/store"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"

const CHECKED_VALUE = "true"

const checkboxFieldAttributesSchema = z.object({
  label: z.string(),
  helperText: z.string(),
  required: z.boolean(),
  customErrorMessage: z.string(),
  disabled: z.boolean(),
})

type CheckboxFieldInstance = ElementInstanceOf<"CheckboxField">

const defaultAttributes: CheckboxFieldInstance["extraAttributes"] = {
  label: "Checkbox field",
  helperText: "",
  required: false,
  customErrorMessage: "",
  disabled: false,
}

export const CheckboxFieldFormElement: FormElement = {
  type: "CheckboxField",
  construct: (id: string) => ({
    id,
    type: "CheckboxField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: CheckSquareOffsetIcon,
    label: "Checkbox",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as CheckboxFieldInstance
    return !element.extraAttributes.required || currentValue === CHECKED_VALUE
  },
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as CheckboxFieldInstance
  return (
    <div className="w-full space-y-1">
      <Label className="flex items-center gap-2 text-sm">
        <Checkbox disabled className={extraAttributes.disabled ? "opacity-50" : ""} />
        {extraAttributes.label}
        {extraAttributes.required && <span className="text-destructive">*</span>}
      </Label>
      {extraAttributes.helperText && (
        <p className="ml-6 text-xs text-muted-foreground">{extraAttributes.helperText}</p>
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
  const { extraAttributes } = elementInstance as CheckboxFieldInstance
  return (
    <Field>
      <FieldLabel className="flex items-center gap-2 font-normal">
        <Checkbox
          disabled={extraAttributes.disabled}
          defaultChecked={defaultValue === CHECKED_VALUE}
          className="mr-2"
        />
        {extraAttributes.label}
        {extraAttributes.required && <span className="text-destructive">*</span>}
      </FieldLabel>
      {extraAttributes.helperText && (
        <FieldDescription className="ml-6">{extraAttributes.helperText}</FieldDescription>
      )}
      {isInvalid && (
        <FieldError className="ml-6">
          {extraAttributes.customErrorMessage || "This field is required"}
        </FieldError>
      )}
    </Field>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CheckboxFieldInstance

  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: { onChange: checkboxFieldAttributesSchema },
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
              <FieldDescription>Appears below the checkbox</FieldDescription>
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
                placeholder="e.g., You must agree to continue"
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
