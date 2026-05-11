import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom"
import { DragDropProvider } from "@dnd-kit/react"
import { SpinnerBallIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

import type { Form } from "#/generated/prisma/client"

import { Designer } from "./designer/canvas"
import { DragOverlayWrapper } from "./designer/overlay"
import { designerStoreActions } from "./designer/store"

const dotBackground = {
  backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.1) 1px, rgb(164 164 164) 1px)",
  backgroundPosition: "50% 50%",
  backgroundSize: "1.1rem 1.1rem",
}

export default function FormBuilder({ form }: { form: Form }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isReady) return
    designerStoreActions.setSelectedElement(null)
    designerStoreActions.setElements(JSON.parse(form.content))
    const t = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(t)
  }, [form, isReady])

  if (!isReady) return <Spinner />
  if (form.published) return <h1>hi</h1>

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
      <main className="flex h-dvh w-full flex-col">
        <BuilderNav name={form.name} />
        <div
          className="relative flex h-50 w-full grow items-center justify-center overflow-y-auto"
          style={dotBackground}
        >
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DragDropProvider>
  )
}

function Spinner() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <SpinnerBallIcon className="h-12 w-12 animate-spin" />
    </div>
  )
}

function BuilderNav({ name }: { name: string }) {
  return (
    <nav className="flex items-center justify-between gap-3 border-b-2 p-4">
      <h2 className="truncate font-medium">
        <span className="mr-2 text-muted-foreground">Form:</span>
        {name}
      </h2>
      <div className="flex items-center gap-2" />
    </nav>
  )
}
