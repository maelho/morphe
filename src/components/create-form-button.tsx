import { useForm } from "@tanstack/react-form-start"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useState } from "react"

import { createForm } from "#/lib/builder.functions"
import { createFormSchema } from "#/lib/builder.schemas"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Textarea } from "./ui/textarea"
import { toastManager } from "./ui/toast"

export function CreateFormButton() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const createFormFn = useServerFn(createForm)

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    validators: {
      onSubmit: createFormSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value)
    },
  })

  const mutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => createFormFn({ data }),
    onSuccess: (result) => {
      if (result.success) {
        toastManager.add({
          type: "success",
          title: "Form created",
          description: result.data.name,
        })
        queryClient.invalidateQueries({ queryKey: ["forms"] })
        setOpen(false)
        form.reset()
      } else {
        toastManager.add({
          type: "error",
          title: "Failed to create form",
          description: result.error.message,
        })
      }
    },
    onError: (error) => {
      toastManager.add({
        type: "error",
        title: "Failed to create form",
        description: error instanceof Error ? error.message : "Unknown error",
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Open Dialog</DialogTrigger>
      <DialogPopup className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
        </DialogHeader>
        <Form
          id="create-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="contents"
        >
          <DialogPanel className="grid gap-4">
            <>
              <form.Field
                name="name"
                // oxlint-disable-next-line react/no-children-prop
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field name={field.name}>
                      <FieldLabel htmlFor={field.name}>
                        Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Name"
                        autoComplete="off"
                      />

                      {typeof field.state.meta.errors[0] === "object" && (
                        <span className="text-xs text-destructive-foreground">
                          {field.state.meta.errors[0].message}
                        </span>
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="description"
                // oxlint-disable-next-line react/no-children-prop
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field name={field.name}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Description"
                        autoComplete="off"
                      />
                      <FieldDescription className="flex w-full justify-end">
                        {field.state.value.length}/120
                      </FieldDescription>
                      {typeof field.state.meta.errors[0] === "object" && (
                        <span className="text-xs text-destructive-foreground">
                          {field.state.meta.errors[0].message}
                        </span>
                      )}
                    </Field>
                  )
                }}
              />
            </>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
