// oxlint-disable react/no-children-prop
import { ListIcon } from "@phosphor-icons/react"

import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "#/components/ui/select"
import { Separator } from "#/components/ui/separator"

import { selectFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { BaseProperties } from "./base-properties"
import { CollapsibleSection } from "./collapsible-section"
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
  label: "Dropdown",
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
    label: "Dropdown",
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
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <ListIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.label || "Dropdown"}</span>
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
  const form = useElementForm(element, selectFieldAttributesSchema)

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
        children={
          <>
            <Separator />
            <CollapsibleSection title="Options">
              <form.Field name="options">
                {(field) => (
                  <OptionsEditor
                    value={field.state.value.map(
                      (opt: { value: string; label: string }, i: number) => ({
                        ...opt,
                        id: `opt-${i}`,
                      }),
                    )}
                    onChange={(options) => {
                      field.handleChange(options.map(({ id: _, ...rest }) => rest))
                      form.handleSubmit()
                    }}
                  />
                )}
              </form.Field>
            </CollapsibleSection>
            <Separator />
            <CollapsibleSection title="Behavior">
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
            </CollapsibleSection>
          </>
        }
      />
    </Form>
  )
}
