import { CheckSquareIcon } from "@phosphor-icons/react"

import { Checkbox } from "#/components/ui/checkbox"
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field"
import { Form } from "#/components/ui/form"

import { checkboxFieldAttributesSchema } from "../form-schemas"
import type {
  ElementInstanceOf,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../form-types"
import { BaseProperties } from "./base-properties"
import { useElementForm } from "./use-element-form"

const CHECKED_VALUE = "true"

type CheckboxFieldInstance = ElementInstanceOf<"CheckboxField">

const defaultAttributes: CheckboxFieldInstance["extraAttributes"] = {
  label: "Checkbox",
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
    icon: CheckSquareIcon,
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
    <div className="flex w-full flex-col gap-2 py-1">
      <div className="flex items-center gap-3">
        <div className="size-4 shrink-0 rounded border-2 border-border bg-muted/40" />
        <span className="text-sm font-medium text-foreground">
          {extraAttributes.label || "Checkbox"}
          {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
        </span>
      </div>
      {extraAttributes.helperText && (
        <span className="ml-7 text-xs text-muted-foreground">{extraAttributes.helperText}</span>
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
}: {
  elementInstance: FormElementInstance
  isInvalid?: boolean
  value?: string
  submitValue?: SubmitFunction
  errorMessage?: string
}) {
  const { extraAttributes } = elementInstance as CheckboxFieldInstance
  const elementId = elementInstance.id
  const checked = value === CHECKED_VALUE

  const handleCheckedChange = (newChecked: boolean) => {
    if (submitValue) {
      submitValue(elementId, newChecked ? CHECKED_VALUE : "")
    }
  }

  return (
    <Field>
      <FieldLabel className="flex items-center gap-2 font-normal">
        <Checkbox
          disabled={extraAttributes.disabled}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          className="mr-2"
        />
        {extraAttributes.label}
        {extraAttributes.required && <span className="text-destructive">*</span>}
      </FieldLabel>
      {extraAttributes.helperText && (
        <FieldDescription className="ml-6">{extraAttributes.helperText}</FieldDescription>
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
  const element = elementInstance as CheckboxFieldInstance
  const form = useElementForm(element, checkboxFieldAttributesSchema)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <BaseProperties form={form} hasPlaceholder={false} />
    </Form>
  )
}
