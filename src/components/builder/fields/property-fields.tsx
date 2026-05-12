import type { ReactNode } from "react"

import { Field, FieldDescription, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
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
        onBlur={() => {
          field.handleBlur()
          form.handleSubmit()
        }}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
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
}: BaseProps & { min?: number; max?: number }): ReactNode {
  return (
    <Field name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        type="number"
        value={(field.state.value as number | null | undefined) ?? ""}
        onBlur={() => {
          field.handleBlur()
          form.handleSubmit()
        }}
        onChange={(e) => {
          const val = e.target.value
          field.handleChange(val === "" ? undefined : Number(val))
        }}
        min={min}
        max={max}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}

export function SwitchProperty({ field, form, label, description }: BaseProps): ReactNode {
  return (
    <Field name={field.name}>
      <div className="flex items-center justify-between">
        <FieldLabel className="mb-0!">{label}</FieldLabel>
        <Switch
          checked={!!field.state.value}
          onCheckedChange={(checked) => {
            field.handleChange(checked)
            form.handleSubmit()
          }}
        />
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
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
      {description && <FieldDescription>{description}</FieldDescription>}
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
        onBlur={() => {
          field.handleBlur()
          form.handleSubmit()
        }}
        onChange={(e) => field.handleChange(e.target.value)}
        rows={rows}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}
