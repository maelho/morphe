import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom"
import { DragDropProvider } from "@dnd-kit/react"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

import type { Form } from "#/generated/prisma/client"

import { Designer } from "./designer"
import { DragOverlayWrapper } from "./designer-overlay-wrapper"
import { designerStoreActions } from "./designer-store"

export default function FormBuilder({ form }: { form: Form }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isReady) return
    const elements = JSON.parse(form.content)
    designerStoreActions.setElements(elements)
    designerStoreActions.setSelectedElement(null)
    const readyTimeout = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(readyTimeout)
  }, [form, isReady])

  if (!isReady) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  if (form.published) {
    return <h1>hi</h1>
  }

  return (
    <DragDropProvider
      sensors={(defaults) => [
        ...defaults.filter((s) => s !== PointerSensor),
        PointerSensor.configure({
          activationConstraints(event) {
            if (event.pointerType === "touch") {
              return [
                new PointerActivationConstraints.Delay({ value: 300, tolerance: { x: 5, y: 5 } }),
              ]
            }
            return [new PointerActivationConstraints.Distance({ value: 10 })]
          },
        }),
      ]}
    >
      <main className="flex w-full flex-col">
        <nav className="flex items-center justify-between gap-3 border-b-2 p-4">
          <h2 className="truncate font-medium">
            <span className="mr-2 text-muted-foreground">Form:</span>
            {form.name}
          </h2>
          <div className="item-center flex gap-2" />
        </nav>
        <div
          className="relative flex h-50 w-full grow items-center justify-center overflow-y-auto"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.1) 1px, rgb(164 164 164) 1px)",
            backgroundPosition: "50% 50%",
            backgroundSize: "1.1rem 1.1rem",
          }}
        >
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DragDropProvider>
  )
}
