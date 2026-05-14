import { ArrowsOutLineVerticalIcon } from "@phosphor-icons/react"

import { Form } from "#/components/ui/form"

import { spacerFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { NumberProperty } from "./property-fields"
import { useElementForm } from "./use-element-form"

type SpacerFieldInstance = ElementInstanceOf<"SpacerField">

const defaultAttributes: SpacerFieldInstance["extraAttributes"] = {
  height: 24,
}

export const SpacerFieldFormElement: FormElement = {
  type: "SpacerField",
  construct: (id: string) => ({
    id: id,
    type: "SpacerField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: ArrowsOutLineVerticalIcon,
    label: "Spacer",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as SpacerFieldInstance
  return (
    <div className="flex w-full flex-col items-center justify-center gap-1 py-1">
      <div
        className="flex w-full items-center justify-center rounded border border-dashed border-border/60 bg-muted/20"
        style={{ height: Math.max(extraAttributes.height, 20) }}
      >
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
          <ArrowsOutLineVerticalIcon className="size-3" />
          <span>{extraAttributes.height}px</span>
        </div>
      </div>
    </div>
  )
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as SpacerFieldInstance
  return <div style={{ height: extraAttributes.height }} />
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as SpacerFieldInstance
  const form = useElementForm(element, spacerFieldAttributesSchema)

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
          <form.Field name="height">
            {(field) => (
              <NumberProperty
                field={field}
                form={form}
                label="Height (px)"
                min={4}
                max={200}
                defaultValue={24}
                description="Space height in pixels (4-200)"
              />
            )}
          </form.Field>
        </div>
      </div>
    </Form>
  )
}