import { ArrowsOutLineVerticalIcon } from "@phosphor-icons/react"

import { Form } from "#/components/ui/form"

import { spacerFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
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
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <ArrowsOutLineVerticalIcon className="size-4 shrink-0" />
      <span>Spacer ({extraAttributes.height}px)</span>
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
      <CollapsibleSection title="Size">
        <form.Field name="height">
          {(field) => (
            <NumberProperty
              field={field}
              form={form}
              label="Height (px)"
              min={4}
              max={200}
              description="Space height in pixels (4-200)"
            />
          )}
        </form.Field>
      </CollapsibleSection>
    </Form>
  )
}
