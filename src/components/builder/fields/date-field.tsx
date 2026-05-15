import { CalendarBlankIcon, CalendarIcon } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import { Calendar } from "#/components/ui/calendar"
import { Field, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover"
import { cn } from "#/lib/utils"

import { dateFieldAttributesSchema } from "../form-schemas"
import type {
  ElementInstanceOf,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../form-types"
import { BaseProperties } from "./base-properties"
import { DateRangeProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"
import { createDateFieldSchema } from "./validation"

type DateFieldInstance = ElementInstanceOf<"DateField">

const defaultAttributes: DateFieldInstance["extraAttributes"] = {
  label: "Date Picker",
  helperText: "",
  required: false,
  minDate: undefined,
  maxDate: undefined,
  customErrorMessage: "",
  disabled: false,
}

export const DateFieldFormElement: FormElement = {
  type: "DateField",
  construct: (id: string) => ({
    id: id,
    type: "DateField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: CalendarIcon,
    label: "Date Picker",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as DateFieldInstance
    const schema = createDateFieldSchema(element.extraAttributes)
    const result = schema.safeParse(currentValue ?? "")
    return result.success
  },
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as DateFieldInstance
  return (
    <div className="flex w-full flex-col gap-2 py-1">
      <span className="text-sm font-medium text-foreground">
        {extraAttributes.label || "Date Picker"}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </span>
      <div className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-3">
        <span className="text-sm text-muted-foreground/60">mm/dd/yyyy</span>
        <CalendarIcon className="size-3.5 text-muted-foreground/40" />
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
  value,
  submitValue,
  errorMessage,
  onBlur,
}: {
  elementInstance: FormElementInstance
  isInvalid?: boolean
  value?: string
  submitValue?: SubmitFunction
  errorMessage?: string
  onBlur?: () => void
}) {
  const { extraAttributes } = elementInstance as DateFieldInstance
  const elementId = elementInstance.id
  const selectedDate = value ? new Date(value + "T00:00:00") : undefined

  const formattedDisplayDate = selectedDate
    ? new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "short",
        day: "numeric",
      }).format(selectedDate)
    : null

  const handleSelect = (date?: Date) => {
    if (!submitValue) return

    const formatted = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}-${String(date.getDate()).padStart(2, "0")}`
      : ""

    submitValue(elementId, formatted)
  }

  return (
    <Field>
      <FieldLabel>
        {extraAttributes.label}
        {extraAttributes.required && <span className="ml-1 text-destructive">*</span>}
      </FieldLabel>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              disabled={extraAttributes.disabled}
              aria-invalid={isInvalid}
              onBlur={onBlur}
              className={cn(
                "w-full justify-between text-left font-normal",
                !selectedDate && "text-muted-foreground",
              )}
            >
              {formattedDisplayDate ? formattedDisplayDate : <span>Pick a date</span>}

              <CalendarBlankIcon className="size-4 opacity-50" />
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            captionLayout="dropdown"
            startMonth={
              extraAttributes.minDate ? new Date(extraAttributes.minDate) : new Date(1900, 0)
            }
            endMonth={
              extraAttributes.maxDate ? new Date(extraAttributes.maxDate) : new Date(2100, 11)
            }
            disabled={(date) => {
              const minDate = extraAttributes.minDate
                ? new Date(extraAttributes.minDate)
                : undefined

              const maxDate = extraAttributes.maxDate
                ? new Date(extraAttributes.maxDate)
                : undefined

              if (minDate && date < minDate) {
                return true
              }

              if (maxDate && date > maxDate) {
                return true
              }

              return false
            }}
          />
        </PopoverContent>
      </Popover>

      {extraAttributes.helperText && (
        <FieldDescription>{extraAttributes.helperText}</FieldDescription>
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
  const element = elementInstance as DateFieldInstance
  const form = useElementForm(element, dateFieldAttributesSchema)

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
        hasPlaceholder={false}
        extraValidationSettings={
          <form.Field name="minDate">
            {(minField) => (
              <form.Field name="maxDate">
                {(maxField) => (
                  <DateRangeProperty
                    fieldFrom={minField}
                    fieldTo={maxField}
                    form={form}
                    label="Date Range"
                  />
                )}
              </form.Field>
            )}
          </form.Field>
        }
      />
    </Form>
  )
}
