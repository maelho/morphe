import { CheckSquareOffsetIcon } from "@phosphor-icons/react"

import { Checkbox } from "#/components/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Separator } from "#/components/ui/separator"

import { checkboxFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { StringProperty, SwitchProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"

const CHECKED_VALUE = "true"

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
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <CheckSquareOffsetIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.label || "Checkbox field"}</span>
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
  const form = useElementForm(element, checkboxFieldAttributesSchema)

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
        <form.Field name="helperText">
          {(field) => (
            <StringProperty
              field={field}
              form={form}
              label="Helper Text"
              description="Appears below the checkbox"
            />
          )}
        </form.Field>
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Validation" defaultOpen>
        <form.Field name="required">
          {(field) => <SwitchProperty field={field} form={form} label="Required" />}
        </form.Field>
        <form.Field name="customErrorMessage">
          {(field) => (
            <StringProperty
              field={field}
              form={form}
              label="Custom Error Message"
              placeholder="e.g., You must agree to continue"
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
