import { ListBulletsIcon } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form-start"
import { useEffect } from "react"
import z from "zod"

import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "#/components/ui/select"
import { Separator } from "#/components/ui/separator"
import { Switch } from "#/components/ui/switch"

import { designerStoreActions } from "../designer/store"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { OptionsEditor } from "./options-editor"
import { createSelectFieldSchema } from "./validation"

const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
})

const selectFieldPropertiesSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
  helperText: z.string(),
  required: z.boolean(),
  options: z.array(selectOptionSchema),
  allowClear: z.boolean(),
  searchable: z.boolean(),
  customErrorMessage: z.string(),
  disabled: z.boolean(),
})

type SelectFieldInstance = ElementInstanceOf<"SelectField">

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
]

const defaultAttributes: SelectFieldInstance["extraAttributes"] = {
  label: "Select field",
  placeholder: "Choose an option",
  helperText: "",
  required: false,
  options: defaultOptions,
  allowClear: false,
  searchable: false,
  customErrorMessage: "",
  disabled: false,
}

export const SelectFieldFormElement: FormElement = {
  type: "SelectField",
  construct: (id: string) => ({
    id,
    type: "SelectField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: ListBulletsIcon,
    label: "Select",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as SelectFieldInstance
    const schema = createSelectFieldSchema(element.extraAttributes)
    return schema.safeParse(currentValue ?? "").success
  },
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as SelectFieldInstance
  const firstOption = extraAttributes.options[0]

  return (
    <div className="w-full space-y-1">
      <Label className="text-sm font-medium">
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <Select value={firstOption} items={extraAttributes.options} disabled>
        <SelectTrigger className={extraAttributes.disabled ? "opacity-50" : ""}>
          <SelectValue />
        </SelectTrigger>
      </Select>
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
  const { extraAttributes } = elementInstance as SelectFieldInstance
  const defaultItem = extraAttributes.options.find((o) => o.value === defaultValue) ?? null

  return (
    <Field>
      <FieldLabel>
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>
      <Select
        value={defaultItem}
        items={extraAttributes.options}
        disabled={extraAttributes.disabled}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {extraAttributes.options.map((option) => (
            <SelectItem key={option.value} value={option}>
              {option.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
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
  const element = elementInstance as SelectFieldInstance

  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: { onChange: selectFieldPropertiesSchema },
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

      <CollapsibleSection title="Options" defaultOpen>
        <form.Field name="options">
          {(field) => (
            <OptionsEditor
              value={field.state.value.map((opt, i) => ({ ...opt, id: `opt-${i}` }))}
              onChange={(options) => {
                field.handleChange(options.map(({ id: _, ...rest }) => rest))
                form.handleSubmit()
              }}
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
                placeholder="e.g., Please select an option"
              />
              <FieldDescription>Shows when validation fails</FieldDescription>
            </Field>
          )}
        </form.Field>
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Behavior">
        <form.Field name="allowClear">
          {(field) => (
            <Field name={field.name}>
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0!">Allow Clear</FieldLabel>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked)
                    form.handleSubmit()
                  }}
                />
              </div>
              <FieldDescription>Allow deselecting</FieldDescription>
            </Field>
          )}
        </form.Field>
        <form.Field name="searchable">
          {(field) => (
            <Field name={field.name}>
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0!">Searchable</FieldLabel>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked)
                    form.handleSubmit()
                  }}
                />
              </div>
              <FieldDescription>Enable filtering options</FieldDescription>
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
