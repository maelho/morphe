import { useForm } from "@tanstack/react-form"
import { useMemo } from "react"

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

  const form = useForm({
    defaultValues: {},
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: (values) => {
      console.log("Form submitted:", values.value)
      alert(`Form submitted! Check console for data.\n\n${JSON.stringify(values.value, null, 2)}`)
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
                form.handleSubmit()
              }}
              className="flex flex-col gap-4"
            >
              {elementOrder.map((id) => {
                const element = elements[id]
                if (!element) return null

                return (
                  <form.Field
                    key={id}
                    name={id}
                    validators={{
                      onBlur: getFieldSchema(element),
                      onSubmit: getFieldSchema(element),
                    }}
                  >
                    {(field) => <FieldWrapper element={element} field={field} />}
                  </form.Field>
                )
              })}
              {elementOrder.length > 0 && (
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
                  <Button type="submit" form="preview-form">
                    Submit
                  </Button>
                </div>
              )}
            </form>
          )}
        </DialogPanel>
      </DialogContent>
    </Dialog>
  )
}

function FieldWrapper({ element, field }: { element: FormElementInstance; field: any }) {
  const FormComponent = FormElements[element.type].formComponent

  const handleChange: SubmitFunction = (_key, value) => {
    field.handleChange(value)
  }

  const errorMessage =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? field.state.meta.errors[0].message
      : undefined

  return (
    <FormComponent
      elementInstance={element}
      submitValue={handleChange}
      onBlur={field.handleBlur}
      value={field.state.value ?? ""}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage}
    />
  )
}
