import { TextAlignLeftIcon } from "@phosphor-icons/react"

import { Field, FieldLabel, FieldDescription } from "#/components/ui/field"
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

import { paragraphFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { TextareaProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"

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
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <TextAlignLeftIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.text || "Paragraph field"}</span>
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
  const form = useElementForm(element, paragraphFieldAttributesSchema)

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
          {(field) => <TextareaProperty field={field} form={form} label="Text" rows={3} />}
        </form.Field>
      </CollapsibleSection>

      <Separator />

      <CollapsibleSection title="Typography" defaultOpen>
        <form.Field name="fontSize">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Font Size</FieldLabel>
              <Select
                value={field.state.value as string}
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
                value={field.state.value as string}
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
                value={(field.state.value as string) || ""}
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
