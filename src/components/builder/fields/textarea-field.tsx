import { TextAlignLeftIcon } from "@phosphor-icons/react"

import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Separator } from "#/components/ui/separator"
import { Textarea } from "#/components/ui/textarea"

import { textareaFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { StringProperty, SwitchProperty, NumberProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"
import { createTextareaFieldSchema } from "./validation"

type TextareaFieldInstance = ElementInstanceOf<"TextareaField">

const DEFAULT_ROWS = 4

const defaultAttributes: TextareaFieldInstance["extraAttributes"] = {
  label: "Textarea field",
  placeholder: "Write your answer",
  helperText: "",
  required: false,
  minLength: undefined,
  maxLength: undefined,
  rows: DEFAULT_ROWS,
  customErrorMessage: "",
  disabled: false,
}

export const TextareaFieldFormElement: FormElement = {
  type: "TextareaField",
  construct: (id: string) => ({
    id,
    type: "TextareaField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: TextAlignLeftIcon,
    label: "Textarea",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as TextareaFieldInstance
    const schema = createTextareaFieldSchema(element.extraAttributes)
    return schema.safeParse(currentValue ?? "").success
  },
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as TextareaFieldInstance
  return (
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <TextAlignLeftIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.label || "Textarea field"}</span>
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
  const { extraAttributes } = elementInstance as TextareaFieldInstance

  return (
    <Field>
      <FieldLabel>
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>
      <Textarea
        placeholder={extraAttributes.placeholder}
        defaultValue={defaultValue}
        aria-invalid={isInvalid}
        disabled={extraAttributes.disabled}
        rows={extraAttributes.rows ?? DEFAULT_ROWS}
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
  const element = elementInstance as TextareaFieldInstance
  const form = useElementForm(element, textareaFieldAttributesSchema)

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
        <form.Field name="rows">
          {(field) => (
            <NumberProperty
              field={field}
              form={form}
              label="Rows"
              min={1}
              max={20}
              description="Number of visible text lines"
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

        <form.Field name="customErrorMessage">
          {(field) => (
            <StringProperty
              field={field}
              form={form}
              label="Custom Error Message"
              placeholder="e.g., Please provide more details"
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
