import { TextHIcon } from "@phosphor-icons/react"

import { Form } from "#/components/ui/form"

import { titleFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { SelectProperty, StringProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"

type TitleFieldInstance = ElementInstanceOf<"TitleField">

const defaultAttributes: TitleFieldInstance["extraAttributes"] = {
  title: "Heading",
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
    icon: TextHIcon,
    label: "Heading",
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
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <TextHIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.title || "Heading"}</span>
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
  const form = useElementForm(element, titleFieldAttributesSchema)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <CollapsibleSection title="Content">
        <form.Field name="title">
          {(field) => <StringProperty field={field} form={form} label="Title" />}
        </form.Field>
      </CollapsibleSection>

      <CollapsibleSection title="Typography">
        <div className="grid grid-cols-2 gap-2">
          <form.Field name="fontSize">
            {(field) => (
              <SelectProperty
                field={field}
                form={form}
                label="Font Size"
                options={[
                  { value: "sm", label: "Small" },
                  { value: "md", label: "Medium" },
                  { value: "lg", label: "Large" },
                  { value: "xl", label: "Extra Large" },
                ]}
              />
            )}
          </form.Field>
          <form.Field name="fontWeight">
            {(field) => (
              <SelectProperty
                field={field}
                form={form}
                label="Font Weight"
                options={[
                  { value: "normal", label: "Normal" },
                  { value: "medium", label: "Medium" },
                  { value: "bold", label: "Bold" },
                ]}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="alignment">
          {(field) => (
            <SelectProperty
              field={field}
              form={form}
              label="Alignment"
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
            />
          )}
        </form.Field>

        <form.Field name="color">
          {(field) => (
            <StringProperty
              field={field}
              form={form}
              label="Color"
              placeholder="#000000 or red"
              description="Hex color or named color"
            />
          )}
        </form.Field>
      </CollapsibleSection>
    </Form>
  )
}
