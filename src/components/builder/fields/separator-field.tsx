import { MinusIcon } from "@phosphor-icons/react"

import { Form } from "#/components/ui/form"
import { Separator } from "#/components/ui/separator"

import { separatorFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { NumberProperty, SelectProperty, StringProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"

type SeparatorFieldInstance = ElementInstanceOf<"SeparatorField">

const defaultAttributes: SeparatorFieldInstance["extraAttributes"] = {
  thickness: 1,
  style: "solid",
  color: undefined,
}

export const SeparatorFieldFormElement: FormElement = {
  type: "SeparatorField",
  construct: (id: string) => ({
    id,
    type: "SeparatorField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: MinusIcon,
    label: "Divider",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
}

const borderStyleClasses = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as SeparatorFieldInstance
  return (
    <div className="flex w-full items-center py-2">
      <div
        className={`w-full border-t ${borderStyleClasses[extraAttributes.style]}`}
        style={{
          borderTopWidth: extraAttributes.thickness,
          borderColor: extraAttributes.color || undefined,
        }}
      />
    </div>
  )
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as SeparatorFieldInstance
  return (
    <Separator
      className={`${borderStyleClasses[extraAttributes.style]}`}
      style={{
        borderTopWidth: extraAttributes.thickness,
        borderColor: extraAttributes.color || undefined,
      }}
    />
  )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as SeparatorFieldInstance
  const form = useElementForm(element, separatorFieldAttributesSchema)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="flex min-h-0 flex-col">
        <div className="space-y-4">
          <form.Field name="thickness">
            {(field) => (
              <NumberProperty
                field={field}
                form={form}
                label="Thickness (px)"
                min={1}
                max={20}
                defaultValue={1}
              />
            )}
          </form.Field>

          <form.Field name="style">
            {(field) => (
              <SelectProperty
                field={field}
                form={form}
                label="Style"
                options={[
                  { value: "solid", label: "Solid" },
                  { value: "dashed", label: "Dashed" },
                  { value: "dotted", label: "Dotted" },
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
                placeholder="#000000 or muted"
                description="Hex color or named color"
              />
            )}
          </form.Field>
        </div>
      </div>
    </Form>
  )
}
