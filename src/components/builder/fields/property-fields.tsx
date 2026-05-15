import { CalendarBlankIcon } from "@phosphor-icons/react"
import type { ReactNode } from "react"
import type { DateRange } from "react-day-picker"

import { Button } from "#/components/ui/button"
import { Calendar } from "#/components/ui/calendar"
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "#/components/ui/number-field"
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { Switch } from "#/components/ui/switch"
import { Textarea } from "#/components/ui/textarea"
import { cn } from "#/lib/utils"

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

interface DateRangePropertyProps {
  fieldFrom: FieldLike
  fieldTo: FieldLike
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

export function DateRangeProperty({
  fieldFrom,
  fieldTo,
  form,
  label,
  description,
}: DateRangePropertyProps): ReactNode {
  const selectedRange: DateRange = {
    from: fieldFrom.state.value ? new Date(fieldFrom.state.value as string) : undefined,
    to: fieldTo.state.value ? new Date(fieldTo.state.value as string) : undefined,
  }

  const formatDate = (date?: Date) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          year: "2-digit",
          month: "short",
          day: "numeric",
        }).format(date)
      : null

  const formatToISO = (date?: Date) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      : undefined

  const handleSelect = (range?: DateRange) => {
    fieldFrom.handleChange(formatToISO(range?.from))
    fieldTo.handleChange(formatToISO(range?.to))

    if (range?.to) {
      fieldFrom.handleBlur()
      fieldTo.handleBlur()
      form.handleSubmit() // persist once the range is complete
    }
  }

  const displayLabel =
    selectedRange.from && selectedRange.to
      ? `${formatDate(selectedRange.from)} – ${formatDate(selectedRange.to)}`
      : selectedRange.from
        ? `${formatDate(selectedRange.from)} – Pick end`
        : "Pick a date range"

  return (
    <Field name={fieldFrom.name}>
      <FieldLabel>{label}</FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-between text-left font-normal",
                !selectedRange.from && "text-muted-foreground",
              )}
            >
              <span>{displayLabel}</span>
              <CalendarBlankIcon className="size-4 opacity-50" />
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            captionLayout="dropdown"
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
      <Description text={description} />
    </Field>
  )
}
