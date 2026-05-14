import { TextAlignLeftIcon } from "@phosphor-icons/react"
import { useState } from "react"

import { Form } from "#/components/ui/form"
import { cn } from "#/lib/utils"

import { paragraphFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
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

type TabValue = "content" | "typography"

function SegmentedControl({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: TabValue; label: string }[]
  value: TabValue
  onChange: (value: TabValue) => void
}) {
  return (
    <div className="flex w-full rounded-md bg-muted/50 p-0.5 text-xs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex-1 rounded-sm px-2 py-1.5 font-medium transition-colors",
            value === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as ParagraphFieldInstance
  const form = useElementForm(element, paragraphFieldAttributesSchema)
  const [activeTab, setActiveTab] = useState<TabValue>("content")

  const tabs = [
    { value: "content" as TabValue, label: "Content" },
    { value: "typography" as TabValue, label: "Typography" },
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