import { ArrowsOutLineVerticalIcon } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form-start"
import { useEffect } from "react"
import z from "zod"

import { Field, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { NumberField, NumberFieldInput } from "#/components/ui/number-field"

import { designerStoreActions } from "../designer/store"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"

const spacerFieldAttributesSchema = z.object({
  height: z.number().min(4).max(200),
})

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
    <div className="flex w-full items-center">
      <div
        className="w-full rounded-sm border border-dashed border-muted-foreground/40"
        style={{ height: extraAttributes.height }}
      />
    </div>
  )
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { extraAttributes } = elementInstance as SpacerFieldInstance
  return <div style={{ height: extraAttributes.height }} />
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as SpacerFieldInstance

  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: {
      onChange: spacerFieldAttributesSchema,
    },
    onSubmit: async ({ value }) => {
      designerStoreActions.updateElement(element.id, { ...element, extraAttributes: value })
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  return (
    <Form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <CollapsibleSection title="Size" defaultOpen>
        <form.Field name="height">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Height (px)</FieldLabel>
              <NumberField
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value ?? 24)
                  form.handleSubmit()
                }}
                min={4}
                max={200}
              >
                <NumberFieldInput />
              </NumberField>
              <FieldDescription>Space height in pixels (4-200)</FieldDescription>
            </Field>
          )}
        </form.Field>
      </CollapsibleSection>
    </Form>
  )
}
