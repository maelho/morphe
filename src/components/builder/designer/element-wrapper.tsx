import { TrashIcon } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import { cn } from "#/lib/utils"

import { FormElements } from "../fields/registry"
import { designerStoreActions, useDesignerElement, useIsSelected } from "./store"
import { useElementDragDrop } from "./use-element-drag-drop"

export function DesignerElementWrapper({ elementId }: { elementId: string }) {
  const element = useDesignerElement(elementId)
  const isSelected = useIsSelected(elementId)
  const { topRef, bottomRef, dragRef, topIsOver, bottomIsOver, isDragging } = useElementDragDrop(
    elementId,
    element?.type,
  )

  if (!element) return null
  if (isDragging) return null

  const DesignerElement = FormElements[element.type].designerComponent
  const selectElement = () => designerStoreActions.setSelectedElement(element.id)

  return (
    <div
      ref={dragRef}
      role="button" // oxlint-disable-line jsx-a11y/prefer-tag-over-role
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          selectElement()
        }
      }}
      onClick={(e) => {
        e.stopPropagation()
        selectElement()
      }}
      className={cn(
        "group relative flex h-30 flex-col rounded-md text-foreground ring-1 ring-accent ring-inset hover:cursor-pointer",
        isSelected && "ring-2 ring-primary",
      )}
    >
      {/* Drop zones */}
      <div ref={topRef} className="absolute h-1/2 w-full rounded-t-md" />
      <div ref={bottomRef} className="absolute bottom-0 h-1/2 w-full rounded-b-md" />

      {/* Drop indicators */}
      {topIsOver && <div className="absolute top-0 h-1.75 w-full rounded-b-none bg-primary" />}
      {bottomIsOver && (
        <div className="absolute bottom-0 h-1.75 w-full rounded-t-none bg-primary" />
      )}

      {/* Hover actions — CSS group-hover, zero JS state */}
      <div className="absolute right-0 hidden h-full group-hover:flex">
        <Button
          className="flex h-full justify-center rounded-md rounded-l-none border bg-red-500"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            designerStoreActions.removeElement(element.id)
          }}
        >
          <TrashIcon className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 animate-pulse group-hover:block">
        <p className="text-sm text-muted-foreground">Click for properties or drag to move</p>
      </div>

      {/* Content */}
      <div
        className={cn(
          "pointer-events-none flex h-30 w-full items-center rounded-md bg-accent/40 px-4 py-2",
          "group-hover:opacity-30",
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  )
}
