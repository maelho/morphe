import { MinusIcon } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form-start"
import { useEffect } from "react"

import { Field, FieldLabel, FieldDescription } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { Separator } from "#/components/ui/separator"

import { designerStoreActions } from "../designer/store"
import { separatorFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"

type SeparatorFieldInstance = ElementInstanceOf<"SeparatorField">

const defaultAttributes: SeparatorFieldInstance["extraAttributes"] = {
  thickness: 1,
  style: "solid",
  color: undefined,
}

export const SeparatorFieldFormElement: FormElement = {
  type: "SeparatorField",
  construct: (id: string) => ({
    id: id,
    type: "SeparatorField",
    extraAttributes: defaultAttributes,
  }),
  designerButtonElement: {
    icon: MinusIcon,
    label: "Separator",
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
    <div className="w-full py-2">
      <Separator
        className={`${borderStyleClasses[extraAttributes.style]}`}
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

  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: {
      onChange: separatorFieldAttributesSchema,
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
      <CollapsibleSection title="Appearance" defaultOpen>
        <form.Field name="thickness">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Thickness (px)</FieldLabel>
              <Input
                type="number"
                min={1}
                max={20}
                value={field.state.value}
                onBlur={() => {
                  field.handleBlur()
                  form.handleSubmit()
                }}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="style">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Style</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value as "solid" | "dashed" | "dotted")
                  form.handleSubmit()
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

        <form.Field name="color">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Color</FieldLabel>
              <Input
                type="text"
                value={field.state.value || ""}
                onBlur={() => {
                  field.handleBlur()
                  form.handleSubmit()
                }}
                onChange={(e) => field.handleChange(e.target.value || undefined)}
                placeholder="#000000 or muted"
              />
              <FieldDescription>Hex color or named color</FieldDescription>
            </Field>
          )}
        </form.Field>
      </CollapsibleSection>
    </Form>
  )
}
