import { TextHOneIcon } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form-start"
import { useEffect } from "react"

import { Field, FieldError, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { Separator } from "#/components/ui/separator"

import { designerStoreActions } from "../designer/store"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
type TitleFieldInstance = ElementInstanceOf<"TitleField">
import { titleFieldAttributesSchema } from "../form-schemas"

const defaultAttributes: TitleFieldInstance["extraAttributes"] = {
  title: "Title field",
  fontSize: "md",
  fontWeight: "bold",
  alignment: "left",
  color: undefined,
}

export const TitleFieldFormElement: FormElement = {
  type: "TitleField",
  construct: (id: string) => ({
    id: id,
    type: "TitleField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: TextHOneIcon,
    label: "Title field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
}

const fontSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
}

const fontWeightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as TitleFieldInstance
  return (
    <div className="w-full">
      <p
        className={`${fontSizeClasses[extraAttributes.fontSize]} ${fontWeightClasses[extraAttributes.fontWeight]} ${alignmentClasses[extraAttributes.alignment]} ${extraAttributes.color || ""}`}
        style={extraAttributes.color ? { color: extraAttributes.color } : undefined}
      >
        {extraAttributes.title}
      </p>
    </div>
  )
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as TitleFieldInstance
  return (
    <p
      className={`${fontSizeClasses[extraAttributes.fontSize]} ${fontWeightClasses[extraAttributes.fontWeight]} ${alignmentClasses[extraAttributes.alignment]} ${extraAttributes.color || ""}`}
      style={extraAttributes.color ? { color: extraAttributes.color } : undefined}
    >
      {extraAttributes.title}
    </p>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as TitleFieldInstance

  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: {
      onChange: titleFieldAttributesSchema,
    },
    onSubmit: async ({ value }) => {
      designerStoreActions.updateElement(element.id, { ...element, extraAttributes: value })
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  return (
    <Form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <CollapsibleSection title="Content" defaultOpen>
        <form.Field name="title">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Title</FieldLabel>
              <Input
                value={field.state.value}
                onBlur={() => {
                  field.handleBlur()
                  form.handleSubmit()
                }}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
              )}
            </Field>
          )}
        </form.Field>
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Typography" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          <form.Field name="fontSize">
            {(field) => (
              <Field name={field.name}>
                <FieldLabel>Font Size</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange(value as "sm" | "md" | "lg" | "xl")
                    form.handleSubmit()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>
          <form.Field name="fontWeight">
            {(field) => (
              <Field name={field.name}>
                <FieldLabel>Font Weight</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange(value as "normal" | "medium" | "bold")
                    form.handleSubmit()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="alignment">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Alignment</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value as "left" | "center" | "right")
                  form.handleSubmit()
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

        <form.Field name="color">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Color</FieldLabel>
              <Input
                type="text"
                value={field.state.value || ""}
                onBlur={() => {
                  field.handleBlur()
                  form.handleSubmit()
                }}
                onChange={(e) => field.handleChange(e.target.value || undefined)}
                placeholder="#000000 or red"
              />
              <FieldDescription>Hex color or named color</FieldDescription>
            </Field>
          )}
        </form.Field>
      </CollapsibleSection>
    </Form>
  )
}
