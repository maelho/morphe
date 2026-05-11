import { Field, FieldDescription } from "#/components/ui/field"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "#/components/ui/number-field"

type FormNumberFieldProps = {
  label: string
  value: number | null
  onValueChange: (value: number | null) => void
  min?: number
  max?: number
  description?: string
}

export function FormNumberField({
  label,
  value,
  onValueChange,
  min,
  max,
  description,
}: FormNumberFieldProps) {
  return (
    <Field>
      <NumberField value={value} onValueChange={onValueChange} min={min} max={max}>
        <NumberFieldScrubArea label={label} />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}
