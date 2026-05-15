import { useForm, type AnyFieldApi } from "@tanstack/react-form"
import { useMemo } from "react"
import type z from "zod"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { useDesignerElements, useDesignerOrder } from "./designer/store"
import { FormElements } from "./fields/registry"
import { buildFormSchema, getFieldSchema } from "./fields/validation"
import type { SubmitFunction, FormElementInstance } from "./form-types"

export default function FormBuilderPreviewButton() {
  const elementOrder = useDesignerOrder()
  const elements = useDesignerElements()

  const formSchema = useMemo(() => {
    return buildFormSchema(elementOrder, elements)
  }, [elementOrder, elements])

  const fieldSchemas = useMemo(() => {
    const schemas: Record<string, z.ZodType> = {}

    for (const id of elementOrder) {
      const element = elements[id]

      if (!element) {
        continue
      }

      schemas[id] = getFieldSchema(element)
    }

    return schemas
  }, [elementOrder, elements])

  const form = useForm({
    defaultValues: {},

    validators: {
      onSubmit: formSchema,
    },

    onSubmit: ({ value }) => {
      console.log("Form submitted:", value)
    },
  })

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" />}>Preview</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Form preview</DialogTitle>

          <DialogDescription>Preview how your form will look to users.</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          {elementOrder.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add an element to preview the form.</p>
          ) : (
            <form
              id="preview-form"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()

                void form.handleSubmit()
              }}
              className="flex flex-col gap-4"
            >
              {elementOrder.map((id) => {
                const element = elements[id]

                if (!element) {
                  return null
                }

                return (
                  <form.Field
                    key={id}
                    name={id}
                    validators={{
                      onBlur: fieldSchemas[id],
                    }}
                  >
                    {(field) => <FieldWrapper element={element} field={field} />}
                  </form.Field>
                )
              })}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                  }}
                >
                  Reset
                </Button>

                <Button type="submit">Submit</Button>
              </div>
            </form>
          )}
        </DialogPanel>
      </DialogContent>
    </Dialog>
  )
}

function FieldWrapper({ element, field }: { element: FormElementInstance; field: AnyFieldApi }) {
  const FormComponent = FormElements[element.type].formComponent

  const handleChange: SubmitFunction = (_key, value) => {
    field.handleChange(value)
  }

  const firstError = field.state.meta.errors[0]

  const errorMessage =
    typeof firstError === "string"
      ? firstError
      : typeof firstError === "object" && firstError !== null && "message" in firstError
        ? String(firstError.message)
        : undefined

  return (
    <FormComponent
      elementInstance={element}
      submitValue={handleChange}
      onBlur={field.handleBlur}
      value={field.state.value ?? ""}
      isInvalid={Boolean(errorMessage)}
      errorMessage={errorMessage}
    />
  )
}
