import { TrashIcon } from "@phosphor-icons/react"
import { useState } from "react"

import { Button } from "#/components/ui/button"
import { cn } from "#/lib/utils"

import { FormElements } from "../fields/registry"
import type { FormElementInstance } from "../form-types"
import { designerStoreActions } from "./store"
import { useElementDragDrop } from "./use-element-drag-drop"

export function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const [mouseIsOver, setMouseIsOver] = useState(false)
  const { topRef, bottomRef, dragRef, topIsOver, bottomIsOver, isDragging } =
    useElementDragDrop(element)

  if (isDragging) return null

  const DesignerElement = FormElements[element.type].designerComponent

  const selectElement = () => designerStoreActions.setSelectedElement(element)

  return (
    <div
      ref={dragRef}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          selectElement()
        }
      }}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation()
        selectElement()
      }}
      className="relative flex h-30 flex-col rounded-md text-foreground ring-1 ring-accent ring-inset hover:cursor-pointer"
    >
      {/* Drop zones */}
      <div ref={topRef} className="absolute h-1/2 w-full rounded-t-md" />
      <div ref={bottomRef} className="absolute bottom-0 h-1/2 w-full rounded-b-md" />

      {/* Drop indicators */}
      {topIsOver && <div className="absolute top-0 h-1.75 w-full rounded-b-none bg-primary" />}
      {bottomIsOver && (
        <div className="absolute bottom-0 h-1.75 w-full rounded-t-none bg-primary" />
      )}

      {/* Hover actions */}
      {mouseIsOver && (
        <ElementHoverActions onDelete={() => designerStoreActions.removeElement(element.id)} />
      )}

      {/* Content */}
      <div
        className={cn(
          "pointer-events-none flex h-30 w-full items-center rounded-md bg-accent/40 px-4 py-2",
          mouseIsOver && "opacity-30",
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  )
}

function ElementHoverActions({ onDelete }: { onDelete: () => void }) {
  return (
    <>
      <div className="absolute right-0 h-full">
        <Button
          className="flex h-full justify-center rounded-md rounded-l-none border bg-red-500"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <TrashIcon className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
        <p className="text-sm text-muted-foreground">Click for properties or drag to move</p>
      </div>
    </>
  )
}
