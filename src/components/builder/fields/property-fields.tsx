import type { ReactNode } from "react"

import { Field, FieldDescription, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "#/components/ui/number-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { Switch } from "#/components/ui/switch"
import { Textarea } from "#/components/ui/textarea"

interface FieldLike {
  name: string
  state: { value: unknown }
  handleBlur: () => void
  handleChange: (value: any) => void
}

interface FormLike {
  handleSubmit: () => void
}

interface BaseProps {
  field: FieldLike
  form: FormLike
  label: string
  description?: string
}

function Description({ text }: { text?: string }) {
  if (!text) return null
  return <FieldDescription>{text}</FieldDescription>
}

function submitOnBlur(field: FieldLike, form: FormLike) {
  return () => {
    field.handleBlur()
    form.handleSubmit()
  }
}

export function StringProperty({
  field,
  form,
  label,
  placeholder,
  description,
}: BaseProps & { placeholder?: string }): ReactNode {
  return (
    <Field name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        value={(field.state.value as string) ?? ""}
        placeholder={placeholder}
        onBlur={submitOnBlur(field, form)}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <Description text={description} />
    </Field>
  )
}

export function NumberProperty({
  field,
  form,
  label,
  min,
  max,
  description,
  defaultValue,
}: BaseProps & { min?: number; max?: number; defaultValue?: number }): ReactNode {
  const currentValue = field.state.value as number | null | undefined

  return (
    <Field name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <NumberField
        value={currentValue ?? defaultValue ?? null}
        min={min}
        max={max}
        onValueChange={(value) => {
          field.handleChange(value ?? undefined)
          field.handleBlur()
          form.handleSubmit()
        }}
      >
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <Description text={description} />
    </Field>
  )
}

export function SwitchProperty({ field, form, label, description }: BaseProps): ReactNode {
  return (
    <Field name={field.name}>
      <div className="flex items-center justify-between">
        <FieldLabel className="mr-2 mb-0!">{label}</FieldLabel>
        <Switch
          checked={!!field.state.value}
          onCheckedChange={(checked) => {
            field.handleChange(checked)
            field.handleBlur()
            form.handleSubmit()
          }}
        />
      </div>
      <Description text={description} />
    </Field>
  )
}

interface SelectOption {
  value: string
  label: string
}

export function SelectProperty({
  field,
  form,
  label,
  options,
  description,
}: BaseProps & { options: SelectOption[] }): ReactNode {
  return (
    <Field name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={field.state.value as string}
        onValueChange={(value) => {
          field.handleChange(value)
          form.handleSubmit()
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Description text={description} />
    </Field>
  )
}

export function TextareaProperty({
  field,
  form,
  label,
  description,
  rows,
}: BaseProps & { rows?: number }): ReactNode {
  return (
    <Field name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        value={(field.state.value as string) ?? ""}
        rows={rows}
        onBlur={submitOnBlur(field, form)}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <Description text={description} />
    </Field>
  )
}

export function DateProperty({ field, form, label, description }: BaseProps): ReactNode {
  return (
    <Field name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        type="date"
        value={(field.state.value as string) || ""}
        onBlur={submitOnBlur(field, form)}
        onChange={(e) => field.handleChange(e.target.value || undefined)}
      />
      <Description text={description} />
    </Field>
  )
}
