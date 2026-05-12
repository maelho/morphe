import { useForm } from "@tanstack/react-form-start"
import { useEffect } from "react"
import type { z } from "zod"

import { designerStoreActions } from "../designer/store"
import type { FormElementInstance } from "../form-types"

export function useElementForm(element: FormElementInstance, schema: z.ZodType) {
  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: { onChange: schema as any },
    onSubmit: async ({ value }) => {
      designerStoreActions.updateElement(element.id, {
        ...element,
        extraAttributes: value,
      } as FormElementInstance)
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  return form
}
