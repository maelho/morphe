import { TextboxIcon } from "@phosphor-icons/react"
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
import { namedPatternSchema } from "../form-schemas" // import the enum
import type { NamedPattern } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { FormNumberField } from "./form-number-field"
import { PatternSelect } from "./pattern-select"
import { createTextFieldSchema } from "./validation"

const textFieldPropertiesSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
  helperText: z.string(),
  required: z.boolean(),
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().nonnegative().optional(),
  pattern: namedPatternSchema.optional(),
  customPattern: z.string().optional(),
  customErrorMessage: z.string(),
  disabled: z.boolean(),
})

type TextFieldInstance = ElementInstanceOf<"TextField">

const defaultAttributes: TextFieldInstance["extraAttributes"] = {
  label: "Text field",
  placeholder: "Type here",
  helperText: "",
  required: false,
  minLength: undefined,
  maxLength: undefined,
  pattern: undefined,
  customPattern: undefined,
  customErrorMessage: "",
  disabled: false,
}

export const TextFieldFormElement: FormElement = {
  type: "TextField",
  construct: (id: string) => ({
    id: id,
    type: "TextField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: TextboxIcon,
    label: "Text",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as TextFieldInstance
    const schema = createTextFieldSchema(element.extraAttributes)
    const result = schema.safeParse(currentValue ?? "")
    return result.success
  },
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as TextFieldInstance
  return (
    <div className="w-full space-y-1">
      <Label className="text-sm font-medium">
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <Input
        placeholder={extraAttributes.placeholder}
        disabled
        className={extraAttributes.disabled ? "opacity-50" : ""}
      />
      {extraAttributes.maxLength && (
        <p className="text-right text-xs text-muted-foreground">
          {0}/{extraAttributes.maxLength}
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
  const { extraAttributes } = elementInstance as TextFieldInstance

  return (
    <Field>
      <FieldLabel>
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>
      <Input
        placeholder={extraAttributes.placeholder}
        defaultValue={defaultValue}
        aria-invalid={isInvalid}
        disabled={extraAttributes.disabled}
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
  const element = elementInstance as TextFieldInstance

  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: {
      onChange: textFieldPropertiesSchema,
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
          <form.Field name="minLength">
            {(field) => (
              <FormNumberField
                label="Min Length"
                value={field.state.value ?? null}
                onValueChange={(value) => {
                  field.handleChange(value ?? undefined)
                  form.handleSubmit()
                }}
                min={0}
              />
            )}
          </form.Field>

          <form.Field name="maxLength">
            {(field) => (
              <FormNumberField
                label="Max Length"
                value={field.state.value ?? null}
                onValueChange={(value) => {
                  field.handleChange(value ?? undefined)
                  form.handleSubmit()
                }}
                min={0}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="pattern">
          {(field) => (
            <form.Field name="customPattern">
              {(customField) => (
                <PatternSelect
                  value={field.state.value ?? "none"}
                  customValue={customField.state.value ?? ""}
                  onChange={(pattern, customPattern) => {
                    field.handleChange(
                      (pattern === "none" ? undefined : pattern) as NamedPattern | undefined,
                    )
                    customField.handleChange(customPattern || undefined)
                    form.handleSubmit()
                  }}
                  description="Validate input against common patterns"
                />
              )}
            </form.Field>
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
                placeholder="e.g., Please enter a valid email"
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
