import { TextboxIcon } from "@phosphor-icons/react"

import { Field, FieldError, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { Separator } from "#/components/ui/separator"

import { textFieldAttributesSchema } from "../form-schemas"
import type { NamedPattern } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { PatternSelect } from "./pattern-select"
import { StringProperty, SwitchProperty, NumberProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"
import { createTextFieldSchema } from "./validation"

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
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <TextboxIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.label || "Text field"}</span>
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
  const form = useElementForm(element, textFieldAttributesSchema)

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
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Validation" defaultOpen>
        <form.Field name="required">
          {(field) => <SwitchProperty field={field} form={form} label="Required" />}
        </form.Field>

        <div className="grid grid-cols-2 gap-2">
          <form.Field name="minLength">
            {(field) => <NumberProperty field={field} form={form} label="Min Length" min={0} />}
          </form.Field>
          <form.Field name="maxLength">
            {(field) => <NumberProperty field={field} form={form} label="Max Length" min={0} />}
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
            <StringProperty
              field={field}
              form={form}
              label="Custom Error Message"
              placeholder="e.g., Please enter a valid email"
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
