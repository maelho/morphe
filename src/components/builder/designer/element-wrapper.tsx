import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import { memo, useCallback } from "react"

import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { cn } from "#/lib/utils"

import { FormElements } from "../fields/registry"
import type { FormElementInstance } from "../form-types"
import { designerStore, useDesignerElement, useIsSelected } from "./store"
import { useElementDragDrop } from "./use-element-drag-drop"

type DragDropState = {
  topRef: (el: HTMLElement | null) => void
  bottomRef: (el: HTMLElement | null) => void
  dragRef: (el: HTMLElement | null) => void
  topIsOver: boolean
  bottomIsOver: boolean
  isDragging: boolean
}

type DropIndicator = "top" | "bottom" | null

function getDropIndicator(topIsOver: boolean, bottomIsOver: boolean): DropIndicator {
  if (topIsOver) return "top"
  if (bottomIsOver) return "bottom"
  return null
}

function EditingBadge() {
  return (
    <Badge className="absolute -top-3 -right-2 z-50">
      <PencilSimpleIcon className="size-3" weight="bold" />
      <span>Editing</span>
    </Badge>
  )
}

function DropIndicatorLine({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-3 left-3 h-0.5 rounded-full bg-foreground/40 transition-opacity duration-150",
        position === "top" ? "-top-1" : "-bottom-1",
      )}
    />
  )
}

function ElementToolbar({ onRemove }: { onRemove: () => void }) {
  return (
    <div
      className={cn(
        "absolute top-1 right-1 flex items-center gap-0.5 rounded-full border border-border/60 bg-background/95 px-1.5 py-0.5 shadow-md backdrop-blur-sm transition-all duration-200",
        "scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100",
      )}
    >
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        aria-label="Remove element"
        className="h-7 w-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

const ElementBody = memo(function ElementBody({
  element,
  dragDrop,
  isSelected,
  onSelect,
  onRemove,
}: {
  element: FormElementInstance
  dragDrop: DragDropState
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
}) {
  const { topRef, bottomRef, dragRef, topIsOver, bottomIsOver, isDragging } = dragDrop
  const dropIndicator = getDropIndicator(topIsOver, bottomIsOver)

  if (isDragging) return null

  const FormComponent = FormElements[element.type].designerComponent

  return (
    <div
      ref={dragRef}
      data-designer-element-id={element.id}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "group relative flex min-h-12 flex-col rounded-xl border border-transparent transition-all duration-200",
        "cursor-pointer touch-none select-none",
        isSelected && "border-foreground/40 ring-1 ring-foreground/10",
        dropIndicator === "top" && "mt-2",
        dropIndicator === "bottom" && "mb-2",
        !isSelected && "hover:border-border/60 hover:bg-muted/30",
      )}
    >
      <div ref={topRef} className="absolute top-0 left-0 h-1/2 w-full rounded-t-md" />
      <div ref={bottomRef} className="absolute bottom-0 left-0 h-1/2 w-full rounded-b-md" />

      {dropIndicator && <DropIndicatorLine position={dropIndicator} />}
      {isSelected && <EditingBadge />}

      <ElementToolbar onRemove={onRemove} />

      <div className="pointer-events-none relative flex min-h-12 w-full flex-col p-4">
        <FormComponent elementInstance={element} />
      </div>
    </div>
  )
})

export function DesignerElementWrapper({ elementId }: { elementId: string }) {
  const element = useDesignerElement(elementId)
  const isSelected = useIsSelected(elementId)
  const dragDrop = useElementDragDrop(elementId, element?.type, isSelected)

  const handleSelect = useCallback(
    () => designerStore.actions.openProperties(elementId),
    [elementId],
  )

  const handleRemove = useCallback(
    () => designerStore.actions.removeElement(elementId),
    [elementId],
  )

  if (!element) return null

  return (
    <ElementBody
      element={element}
      dragDrop={dragDrop}
      isSelected={isSelected}
      onSelect={handleSelect}
      onRemove={handleRemove}
    />
  )
}
