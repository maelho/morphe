import { TextTIcon } from "@phosphor-icons/react"

import { Form } from "#/components/ui/form"

import { subtitleFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { SelectProperty, StringProperty } from "./property-fields"
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
    icon: TextTIcon,
    label: "Subtitle",
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
      <TextTIcon className="size-4 shrink-0" />
      <span className="truncate">{extraAttributes.subtitle || "Subtitle"}</span>
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
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <CollapsibleSection title="Content">
        <form.Field name="subtitle">
          {(field) => <StringProperty field={field} form={form} label="Subtitle" />}
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
