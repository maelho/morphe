import { TextHIcon } from "@phosphor-icons/react"

import { Form } from "#/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs"

import { titleFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
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

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <Tabs defaultValue="content" className="flex min-h-0 flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="content" className="flex-1">
            Content
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex-1">
            Typography
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 overflow-y-auto pt-4">
          <div className="space-y-4">
            <form.Field name="title">
              {(field) => <StringProperty field={field} form={form} label="Title" />}
            </form.Field>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="flex-1 overflow-y-auto pt-4">
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
        </TabsContent>
      </Tabs>
    </Form>
  )
}
