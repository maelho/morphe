import { TextAlignLeftIcon } from "@phosphor-icons/react"
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
import { Textarea } from "#/components/ui/textarea"

import { designerStoreActions } from "../designer/store"
import { paragraphFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"

type ParagraphFieldInstance = ElementInstanceOf<"ParagraphField">

const defaultAttributes: ParagraphFieldInstance["extraAttributes"] = {
  text: "Paragraph text",
  fontSize: "md",
  alignment: "left",
  color: undefined,
}

export const ParagraphFieldFormElement: FormElement = {
  type: "ParagraphField",
  construct: (id: string) => ({
    id: id,
    type: "ParagraphField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: TextAlignLeftIcon,
    label: "Paragraph",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
}

const fontSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as ParagraphFieldInstance
  return (
    <div className="w-full">
      <p
        className={`leading-relaxed text-muted-foreground ${fontSizeClasses[extraAttributes.fontSize]} ${alignmentClasses[extraAttributes.alignment]} ${extraAttributes.color || ""}`}
        style={extraAttributes.color ? { color: extraAttributes.color } : undefined}
      >
        {extraAttributes.text}
      </p>
    </div>
  )
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as ParagraphFieldInstance
  return (
    <p
      className={`leading-relaxed text-muted-foreground ${fontSizeClasses[extraAttributes.fontSize]} ${alignmentClasses[extraAttributes.alignment]} ${extraAttributes.color || ""}`}
      style={extraAttributes.color ? { color: extraAttributes.color } : undefined}
    >
      {extraAttributes.text}
    </p>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as ParagraphFieldInstance

  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: {
      onChange: paragraphFieldAttributesSchema,
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
        <form.Field name="text">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Text</FieldLabel>
              <Textarea
                value={field.state.value}
                onBlur={() => {
                  field.handleBlur()
                  form.handleSubmit()
                }}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
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
        <form.Field name="fontSize">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Font Size</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value as "sm" | "md" | "lg")
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
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

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
