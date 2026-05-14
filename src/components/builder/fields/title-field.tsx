import { TextHIcon } from "@phosphor-icons/react"
import { useState } from "react"

import { Form } from "#/components/ui/form"
import { cn } from "#/lib/utils"

import { titleFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { SelectProperty, StringProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"

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
    <div className="flex w-full flex-col py-1">
      <p
        className={`${fontSizeClasses[extraAttributes.fontSize]} ${fontWeightClasses[extraAttributes.fontWeight]} ${alignmentClasses[extraAttributes.alignment]}`}
        style={extraAttributes.color ? { color: extraAttributes.color } : undefined}
      >
        {extraAttributes.title || "Heading"}
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
  const form = useElementForm(element, titleFieldAttributesSchema)
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
              <form.Field name="title">
                {(field) => <StringProperty field={field} form={form} label="Title" />}
              </form.Field>
            </div>
          )}
          {activeTab === "typography" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
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
            </div>
          )}
        </div>
      </div>
    </Form>
  )
}
