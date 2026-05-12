import { MinusIcon } from "@phosphor-icons/react"

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

import { separatorFieldAttributesSchema } from "../form-schemas"
import type { ElementInstanceOf, FormElement, FormElementInstance } from "../form-types"
import { CollapsibleSection } from "./collapsible-section"
import { NumberProperty } from "./property-fields"
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

function DesignerComponent(_elementInstance: { elementInstance: FormElementInstance }) {
  return (
    <div className="flex w-full items-center gap-2 text-sm text-muted-foreground">
      <MinusIcon className="size-4 shrink-0" />
      <span>Separator</span>
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
            <NumberProperty field={field} form={form} label="Thickness (px)" min={1} max={20} />
          )}
        </form.Field>

        <form.Field name="style">
          {(field) => (
            <Field name={field.name}>
              <FieldLabel>Style</FieldLabel>
              <Select
                value={field.state.value as string}
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
                value={(field.state.value as string) || ""}
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
