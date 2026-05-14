import { TextboxIcon } from "@phosphor-icons/react"

import { Field, FieldError, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"

import { textFieldAttributesSchema } from "../form-schemas"
import type { NamedPattern } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { BaseProperties } from "./base-properties"
import { PatternSelect } from "./pattern-select"
import { NumberProperty } from "./property-fields"
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
  construct: (id) => ({
    id,
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
    return schema.safeParse(currentValue ?? "").success
  },
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as TextFieldInstance
  return (
    <div className="flex w-full flex-col gap-2 py-1">
      <span className="text-sm font-medium text-foreground">
        {extraAttributes.label || "Text field"}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </span>
      <div className="flex h-9 w-full items-center rounded-lg border border-border bg-muted/40 px-3">
        <span className="truncate text-sm text-muted-foreground/60">
          {extraAttributes.placeholder || "Type here…"}
        </span>
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

function TextFieldValidationSettings({ form }: { form: ReturnType<typeof useElementForm> }) {
  return (
    <>
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
                description="Validate input against common patterns"
                onChange={(pattern, customPattern) => {
                  field.handleChange(
                    (pattern === "none" ? undefined : pattern) as NamedPattern | undefined,
                  )
                  customField.handleChange(customPattern || undefined)
                  form.handleSubmit()
                }}
              />
            )}
          </form.Field>
        )}
      </form.Field>
    </>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as TextFieldInstance
  const form = useElementForm(element, textFieldAttributesSchema)

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
        extraValidationSettings={<TextFieldValidationSettings form={form} />}
      />
    </Form>
  )
}
