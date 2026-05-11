import { Field, FieldDescription, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { Separator } from "#/components/ui/separator"
import { Switch } from "#/components/ui/switch"

import { CollapsibleSection } from "./collapsible-section"

type FieldApi = {
  name: string
  state: { value: string }
  handleBlur: () => void
  handleChange: (value: string) => void
}

type BooleanFieldApi = {
  name: string
  state: { value: boolean }
  handleChange: (value: boolean) => void
}

type BasicSettingsProps = {
  labelField: FieldApi
  placeholderField?: FieldApi
  helperTextField: FieldApi
  onBlurSubmit: () => void
}

export function BasicSettingsSection({
  labelField,
  placeholderField,
  helperTextField,
  onBlurSubmit,
}: BasicSettingsProps) {
  return (
    <CollapsibleSection title="Basic Settings" defaultOpen>
      <Field name={labelField.name}>
        <FieldLabel>Label</FieldLabel>
        <Input
          value={labelField.state.value}
          onBlur={onBlurSubmit}
          onChange={(e) => labelField.handleChange(e.target.value)}
        />
      </Field>

      {placeholderField && (
        <Field name={placeholderField.name}>
          <FieldLabel>Placeholder</FieldLabel>
          <Input
            value={placeholderField.state.value}
            onBlur={onBlurSubmit}
            onChange={(e) => placeholderField!.handleChange(e.target.value)}
          />
        </Field>
      )}

      <Field name={helperTextField.name}>
        <FieldLabel>Helper Text</FieldLabel>
        <Input
          value={helperTextField.state.value}
          onBlur={onBlurSubmit}
          onChange={(e) => helperTextField.handleChange(e.target.value)}
        />
        <FieldDescription>Appears below the field</FieldDescription>
      </Field>
    </CollapsibleSection>
  )
}

type RequiredSwitchProps = {
  field: BooleanFieldApi
  onSubmit: () => void
}

export function RequiredSwitch({ field, onSubmit }: RequiredSwitchProps) {
  return (
    <Field name={field.name}>
      <div className="flex items-center justify-between">
        <FieldLabel className="mb-0!">Required</FieldLabel>
        <Switch
          checked={field.state.value}
          onCheckedChange={(checked) => {
            field.handleChange(checked)
            onSubmit()
          }}
        />
      </div>
    </Field>
  )
}

type CustomErrorMessageProps = {
  field: FieldApi
  onBlurSubmit: () => void
  placeholder?: string
}

export function CustomErrorMessageField({
  field,
  onBlurSubmit,
  placeholder = "Custom error message",
}: CustomErrorMessageProps) {
  return (
    <Field name={field.name}>
      <FieldLabel>Custom Error Message</FieldLabel>
      <Input
        value={field.state.value || ""}
        onBlur={onBlurSubmit}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
      />
      <FieldDescription>Shows when validation fails</FieldDescription>
    </Field>
  )
}

type DisabledSwitchProps = {
  field: BooleanFieldApi
  onSubmit: () => void
}

export function AdvancedSection({ field, onSubmit }: DisabledSwitchProps) {
  return (
    <>
      <Separator />
      <CollapsibleSection title="Advanced">
        <Field name={field.name}>
          <div className="flex items-center justify-between">
            <FieldLabel className="mb-0!">Disabled</FieldLabel>
            <Switch
              checked={field.state.value}
              onCheckedChange={(checked) => {
                field.handleChange(checked)
                onSubmit()
              }}
            />
          </div>
          <FieldDescription>Prevent user interaction</FieldDescription>
        </Field>
      </CollapsibleSection>
    </>
  )
}
