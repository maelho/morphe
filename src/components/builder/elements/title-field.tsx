import { TextHOneIcon } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form-start"
import { useEffect } from "react"
import z from "zod"

import { Field, FieldError, FieldLabel } from "#/components/ui/field"
import { Form } from "#/components/ui/form"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"

import { designerStoreActions } from "../designer-store"
import type { FormElement, FormElementInstance } from "../types/elements"

const extraAttributes = {
  title: "Title field",
}

const propertiesSchema = z.object({
  title: z.string().min(2).max(50),
})

type CustomInstance = Omit<FormElementInstance, "extraAttributes"> & {
  extraAttributes: typeof extraAttributes
}

export const TitleFieldFormElement: FormElement = {
  type: "TitleField",
  construct: (id: string) => ({
    id: id,
    type: "TitleField",
    extraAttributes,
  }),
  designerButtonElement: {
    icon: TextHOneIcon,
    label: "Tittle field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { title } = element.extraAttributes
  return (
    <div>
      <Label>Title field</Label>
      <p>{title}</p>
    </div>
  )
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance

  const { title } = element.extraAttributes
  return <p>{title}</p>
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance

  const form = useForm({
    defaultValues: {
      title: element.extraAttributes.title,
    },

    validators: {
      onChange: propertiesSchema,
    },

    onSubmit: async ({ value }) => {
      designerStoreActions.updateElement(element.id, {
        ...element,
        extraAttributes: {
          title: value.title,
        },
      })
    },
  })

  useEffect(() => {
    form.reset({
      title: element.extraAttributes.title,
    })
  }, [element, form])

  return (
    <Form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field name="title">
        {(field) => (
          <Field name={field.name}>
            <FieldLabel>Title</FieldLabel>

            <Input
              name={field.name}
              value={field.state.value}
              onBlur={() => {
                field.handleBlur()
                form.handleSubmit()
              }}
              onChange={(e) => field.handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  e.currentTarget.blur()
                }
              }}
            />

            {field.state.meta.errors.length > 0 && (
              <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
            )}
          </Field>
        )}
      </form.Field>
    </Form>
  )
}
