import { TextAlignLeftIcon } from "@phosphor-icons/react"
import { useState } from "react"

import { Form } from "#/components/ui/form"

import { paragraphFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { SegmentedControl } from "./base-properties"
import { SelectProperty, StringProperty, TextareaProperty } from "./property-fields"
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
    <div className="flex w-full flex-col py-1">
      <p
        className={`leading-relaxed text-muted-foreground ${fontSizeClasses[extraAttributes.fontSize]} ${alignmentClasses[extraAttributes.alignment]}`}
        style={extraAttributes.color ? { color: extraAttributes.color } : undefined}
      >
        {extraAttributes.text || "Paragraph text"}
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
  const form = useElementForm(element, paragraphFieldAttributesSchema)
  const [activeTab, setActiveTab] = useState<"content" | "typography">("content")

  const tabs = [
    { value: "content" as const, label: "Content" },
    { value: "typography" as const, label: "Typography" },
  ]

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="flex min-h-0 flex-col">
        <SegmentedControl tabs={tabs} value={activeTab} onChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto pt-4">
          {activeTab === "content" && (
            <div className="space-y-4">
              <form.Field name="text">
                {(field) => <TextareaProperty field={field} form={form} label="Text" rows={3} />}
              </form.Field>
            </div>
          )}
          {activeTab === "typography" && (
            <div className="space-y-4">
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
            </div>
          )}
        </div>
      </div>
    </Form>
  )
}
