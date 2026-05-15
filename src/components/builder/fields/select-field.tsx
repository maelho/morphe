import { CaretDownIcon, ListIcon } from "@phosphor-icons/react"

import { Field, FieldDescription, FieldLabel } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "#/components/ui/select"

import { selectFieldAttributesSchema } from "../form-schemas"
import type {
  ElementInstanceOf,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../form-types"
import { BaseProperties } from "./base-properties"
import { OptionsEditor } from "./options-editor"
import { SwitchProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"
import { createSelectFieldSchema } from "./validation"

type SelectFieldInstance = ElementInstanceOf<"SelectField">

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
]

const defaultAttributes: SelectFieldInstance["extraAttributes"] = {
  label: "Select",
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
    icon: ListIcon,
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
  return (
    <div className="flex w-full flex-col gap-2 py-1">
      <span className="text-sm font-medium text-foreground">
        {extraAttributes.label || "Dropdown"}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </span>
      <div className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-3">
        <span className="text-sm text-muted-foreground/60">
          {extraAttributes.placeholder || "Choose an option"}
        </span>
        <CaretDownIcon className="size-3.5 text-muted-foreground/40" />
      </div>
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
  errorMessage,
  onBlur,
}: {
  elementInstance: FormElementInstance
  isInvalid?: boolean
  value?: string
  submitValue?: SubmitFunction
  errorMessage?: string
  onBlur?: () => void
}) {
  const { extraAttributes } = elementInstance as SelectFieldInstance
  const elementId = elementInstance.id
  const selectedItem = extraAttributes.options.find((o) => o.value === value) ?? null

  const handleValueChange = (item: { value: string; label: string } | null) => {
    if (submitValue) {
      submitValue(elementId, item?.value ?? "")
    }
  }

  return (
    <Field>
      <FieldLabel>
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>
      <Select
        value={selectedItem}
        items={extraAttributes.options}
        disabled={extraAttributes.disabled}
        onValueChange={handleValueChange}
      >
        <SelectTrigger onBlur={onBlur}>
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
        <span className="text-xs text-destructive-foreground">
          {extraAttributes.customErrorMessage || errorMessage || "This field is required"}
        </span>
      )}
    </Field>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as SelectFieldInstance
  const form = useElementForm(element, selectFieldAttributesSchema)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <BaseProperties form={form}>
        <form.Field name="options">
          {(field) => {
            const options = Array.isArray(field.state.value) ? field.state.value : []
            return (
              <OptionsEditor
                value={options.map((opt: { value: string; label: string }, i: number) => ({
                  ...opt,
                  id: `opt-${i}`,
                }))}
                onChange={(options) => {
                  field.handleChange(options.map(({ id: _, ...rest }) => rest))
                  form.handleSubmit()
                }}
              />
            )
          }}
        </form.Field>
        <form.Field name="allowClear">
          {(field) => (
            <SwitchProperty
              field={field}
              form={form}
              label="Allow Clear"
              description="Allow deselecting"
            />
          )}
        </form.Field>
        <form.Field name="searchable">
          {(field) => (
            <SwitchProperty
              field={field}
              form={form}
              label="Searchable"
              description="Enable filtering options"
            />
          )}
        </form.Field>
      </BaseProperties>
    </Form>
  )
}
