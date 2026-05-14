import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom"
import { DragDropProvider } from "@dnd-kit/react"
import { useEffect, useRef, useState } from "react"

import { Designer } from "#/components/builder/designer/canvas"
import { DragOverlayWrapper } from "#/components/builder/designer/overlay"
import { designerStoreActions, designerStoreFormActions } from "#/components/builder/designer/store"
import { parseFormContent } from "#/components/builder/form-utils"
import { Spinner } from "#/components/ui/spinner"
import type { Form } from "#/generated/prisma/client"

export default function FormBuilder({ form }: { form: Form }) {
  const [isReady, setIsReady] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    designerStoreFormActions.setFormInfo(form.id, form.name)

    designerStoreActions.setSelectedElement(null)
    try {
      designerStoreActions.setElements(parseFormContent(form.content))
    } catch (err) {
      console.error("Failed to load form content:", err)
      designerStoreActions.setElements([])
    }

    Promise.resolve().then(() => setIsReady(true))

    return () => {
      mountedRef.current = false
      designerStoreActions.clearElements()
      designerStoreFormActions.clearFormInfo()
    }
  }, [form])

  if (!isReady)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner aria-label="Loading" />
      </div>
    )

  if (form.published) return <h1>Form is published</h1>

  return (
    <DragDropProvider
      sensors={(defaults) => [
        ...defaults.filter((s) => s !== PointerSensor),
        PointerSensor.configure({
          activatorElements(source) {
            return [source.element, source.handle].filter(Boolean)
          },
          activationConstraints(event) {
            if (event.pointerType === "touch") {
              return [
                new PointerActivationConstraints.Delay({ value: 300, tolerance: { x: 5, y: 5 } }),
              ]
            }
            return [new PointerActivationConstraints.Distance({ value: 2 })]
          },
        }),
      ]}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <Designer />
      </div>
      <DragOverlayWrapper />
    </DragDropProvider>
  )
}
