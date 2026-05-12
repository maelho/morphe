import { TextStrikethroughIcon } from "@phosphor-icons/react"

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

import { subtitleFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { StringProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"

type SubtitleFieldInstance = ElementInstanceOf<"SubtitleField">

const defaultAttributes: SubtitleFieldInstance["extraAttributes"] = {
  subtitle: "Subtitle",
  fontSize: "md",
  fontWeight: "normal",
  alignment: "left",
  color: undefined,
}

export const SubtitleFieldFormElement: FormElement = {
  type: "SubtitleField",
  construct: (id: string) => ({
    id: id,
    type: "SubtitleField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: TextStrikethroughIcon,
    label: "Subtitle field",
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

const fontWeightClasses = {
  normal: "font-normal",
  medium: "font-medium",
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as SubtitleFieldInstance
  return (
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <TextStrikethroughIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.subtitle || "Subtitle field"}</span>
    </div>
  )
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as SubtitleFieldInstance
  return (
    <p
      className={`text-muted-foreground ${fontSizeClasses[extraAttributes.fontSize]} ${fontWeightClasses[extraAttributes.fontWeight]} ${alignmentClasses[extraAttributes.alignment]} ${extraAttributes.color || ""}`}
      style={extraAttributes.color ? { color: extraAttributes.color } : undefined}
    >
      {extraAttributes.subtitle}
    </p>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as SubtitleFieldInstance
  const form = useElementForm(element, subtitleFieldAttributesSchema)

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
        <form.Field name="subtitle">
          {(field) => <StringProperty field={field} form={form} label="Subtitle" />}
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
          <form.Field name="fontWeight">
            {(field) => (
              <Field name={field.name}>
                <FieldLabel>Font Weight</FieldLabel>
                <Select
                  value={field.state.value as string}
                  onValueChange={(value) => {
                    field.handleChange(value as "normal" | "medium")
                    form.handleSubmit()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
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
