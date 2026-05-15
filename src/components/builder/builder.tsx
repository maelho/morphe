import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom"
import { DragDropProvider } from "@dnd-kit/react"
import { useEffect, useRef, useState } from "react"

import { Designer } from "#/components/builder/designer/canvas"
import { DragOverlayWrapper } from "#/components/builder/designer/overlay"
import { loadFromStorage, useDesignerPersistence } from "#/components/builder/designer/use-designer-persistence"
import { designerStore } from "#/components/builder/designer/store"
import { parseFormContent } from "#/components/builder/form-utils"
import { Spinner } from "#/components/ui/spinner"
import type { Form } from "#/generated/prisma/client"

export default function FormBuilder({ form }: { form: Form }) {
  useDesignerPersistence(designerStore)

  const [isReady, setIsReady] = useState(false)
  const loadedRef = useRef(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    mountedRef.current = true

    designerStore.actions.setFormInfo(form.id, form.name)
    designerStore.actions.setSelectedElement(null)

    const saved = loadFromStorage(form.id)
    if (saved && saved.elements && Object.keys(saved.elements).length > 0) {
      const elements = Object.values(saved.elements)
      designerStore.actions.setElements(elements)
    } else {
      try {
        designerStore.actions.setElements(parseFormContent(form.content))
      } catch (err) {
        console.error("Failed to load form content:", err)
        designerStore.actions.setElements([])
      }
    }

    Promise.resolve().then(() => setIsReady(true))

    return () => {
      mountedRef.current = false
      designerStore.actions.clearElements()
      designerStore.actions.clearFormInfo()
    }
  }, [form])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const isCtrl = isMac ? e.metaKey : e.ctrlKey

      if (isCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        designerStore.actions.undo()
      } else if (isCtrl && e.key === "z" && e.shiftKey) {
        e.preventDefault()
        designerStore.actions.redo()
      } else if (isCtrl && e.key === "y") {
        e.preventDefault()
        designerStore.actions.redo()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

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
