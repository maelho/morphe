import { DotsSixVerticalIcon, PencilSimpleIcon, TrashIcon, XIcon } from "@phosphor-icons/react"
import { memo, useCallback } from "react"

import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { cn } from "#/lib/utils"

import { FormElements } from "../fields/registry"
import type { FormElementInstance } from "../form-types"
import { PropertiesPanel } from "./properties-panel"
import {
  designerStore,
  designerStoreActions,
  useDesignerElement,
  useEditingElementId,
  useIsSelected,
} from "./store"
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

function ElementToolbar({
  isSelected,
  isEditing,
  onToggleEdit,
  onRemove,
}: {
  isSelected: boolean
  isEditing: boolean
  onToggleEdit: () => void
  onRemove: () => void
}) {
  const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => e.stopPropagation()

  return (
    <div
      className={cn(
        "absolute top-1 right-1 items-center gap-0.5 rounded-full border border-border/60 bg-background/95 px-1 py-0.5 shadow-md backdrop-blur-sm transition-all duration-200",
        "scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100",
        (isSelected || isEditing) && "flex scale-100 opacity-100",
        !isSelected && !isEditing && "hidden group-hover:flex",
      )}
    >
      <button
        type="button"
        aria-label="Drag element"
        className="inline-flex h-7 w-7 cursor-grab items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <DotsSixVerticalIcon className="h-4 w-4" />
      </button>

      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        aria-label={isEditing ? "Close editor" : "Edit element"}
        className={cn(
          "h-7 w-7 rounded-full transition-colors",
          isEditing && "bg-accent text-accent-foreground hover:bg-accent/90",
        )}
        onClick={(e) => {
          e.stopPropagation()
          onToggleEdit()
        }}
      >
        {isEditing ? <XIcon className="h-4 w-4" /> : <PencilSimpleIcon className="h-4 w-4" />}
      </Button>

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
  isEditing,
  onSelect,
  onToggleEdit,
  onRemove,
}: {
  element: FormElementInstance
  dragDrop: DragDropState
  isSelected: boolean
  isEditing: boolean
  onSelect: () => void
  onToggleEdit: () => void
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
        "touch-none select-none",
        isSelected && "border-foreground/30 shadow-sm/10",
        isEditing && "border-foreground/40 ring-1 ring-foreground/10",
        dropIndicator === "top" && "mt-2",
        dropIndicator === "bottom" && "mb-2",
        !isSelected && !isEditing && "hover:border-border/60 hover:bg-muted/30",
      )}
    >
      <div ref={topRef} className="absolute top-0 left-0 h-1/2 w-full rounded-t-md" />
      <div ref={bottomRef} className="absolute bottom-0 left-0 h-1/2 w-full rounded-b-md" />

      {dropIndicator && <DropIndicatorLine position={dropIndicator} />}
      {isEditing && <EditingBadge />}

      <ElementToolbar
        isSelected={isSelected}
        isEditing={isEditing}
        onToggleEdit={onToggleEdit}
        onRemove={onRemove}
      />

      <div className="pointer-events-none relative flex min-h-12 w-full flex-col p-4">
        <FormComponent elementInstance={element} />
      </div>

      {isEditing && (
        <div
          role="presentation"
          className="border-t border-border/40 bg-muted/20 p-4"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <PropertiesPanel element={element} />
        </div>
      )}
    </div>
  )
})

export function DesignerElementWrapper({ elementId }: { elementId: string }) {
  const element = useDesignerElement(elementId)
  const editingElementId = useEditingElementId()
  const isEditing = editingElementId === elementId
  const isSelected = useIsSelected(elementId)
  const dragDrop = useElementDragDrop(elementId, element?.type, isEditing)

  const handleSelect = useCallback(
    () => designerStoreActions.setSelectedElement(elementId),
    [elementId],
  )

  const handleToggleEdit = useCallback(() => {
    if (designerStore.state.editingElementId === elementId) {
      designerStoreActions.closeProperties()
    } else {
      designerStoreActions.openProperties(elementId)
    }
  }, [elementId])

  const handleRemove = useCallback(() => designerStoreActions.removeElement(elementId), [elementId])

  if (!element) return null

  return (
    <ElementBody
      element={element}
      dragDrop={dragDrop}
      isSelected={isSelected}
      isEditing={isEditing}
      onSelect={handleSelect}
      onToggleEdit={handleToggleEdit}
      onRemove={handleRemove}
    />
  )
}
