import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom"
import { DragDropProvider } from "@dnd-kit/react"
import { useEffect, useRef, useState } from "react"

import { Designer } from "#/components/builder/designer/canvas"
import { DragOverlayWrapper } from "#/components/builder/designer/overlay"
import { designerStoreActions } from "#/components/builder/designer/store"
import { parseFormContent } from "#/components/builder/form-utils"
import { FormBuilderPreviewPanel } from "#/components/builder/preview-panel"
import { Spinner } from "#/components/ui/spinner"
import type { Form } from "#/generated/prisma/client"

export default function FormBuilder({ form }: { form: Form }) {
  const [isReady, setIsReady] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

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
      <main className="flex h-dvh w-full flex-col">
        <BuilderNav name={form.name} />
        <div className="relative flex h-50 w-full grow items-center justify-center overflow-hidden">
          <div className="flex h-full w-full">
            <div className="min-w-0 basis-[45%]">
              <Designer />
            </div>
            <aside className="hidden h-full basis-[55%] lg:block">
              <FormBuilderPreviewPanel />
            </aside>
          </div>
        </div>
      </main>
      <DragOverlayWrapper />
    </DragDropProvider>
  )
}

function BuilderNav({ name }: { name: string }) {
  return (
    <nav className="flex items-center justify-between gap-3 border-b-2 p-4">
      <h2 className="truncate font-medium">
        <span className="mr-2 text-muted-foreground">Form:</span>
        {name}
      </h2>
      {/* Optional preview button */}
    </nav>
  )
}
