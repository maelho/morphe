import { useForm } from "@tanstack/react-form"
import { useEffect } from "react"
import type { z } from "zod"

import { designerStore } from "../designer/store"
import type { FormElementInstance } from "../form-types"

export function useElementForm(element: FormElementInstance, schema: z.ZodType<any, any, any>) {
  const form = useForm({
    defaultValues: element.extraAttributes,
    validators: { onChange: schema },
    onSubmit: ({ value }) => {
      designerStore.actions.updateElement(element.id, {
        ...element,
        extraAttributes: value,
      } as FormElementInstance)
    },
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element])

  return form
}
