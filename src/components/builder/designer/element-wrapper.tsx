// oxlint-disable jsx-a11y/prefer-tag-over-role
import { DotsSixVerticalIcon, TrashIcon } from "@phosphor-icons/react"
import { memo, useRef, type RefObject } from "react"

import { Button } from "#/components/ui/button"
import { cn } from "#/lib/utils"

import { FormElements } from "../fields/registry"
import type { FormElementInstance } from "../form-types"
import { designerStoreActions, useDesignerElement, useIsSelected } from "./store"
import { useElementDragDrop } from "./use-element-drag-drop"

type DragDropState = {
  topRef: (el: HTMLElement | null) => void
  bottomRef: (el: HTMLElement | null) => void
  dragRef: (el: HTMLElement | null) => void
  topIsOver: boolean
  bottomIsOver: boolean
  isDragging: boolean
}

export function DesignerElementWrapper({ elementId }: { elementId: string }) {
  const element = useDesignerElement(elementId)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dragDrop = useElementDragDrop(elementId, element?.type, buttonRef)

  return (
    <DesignerElementPresentation
      elementId={elementId}
      element={element}
      dragDrop={dragDrop}
      buttonRef={buttonRef}
    />
  )
}

const DesignerElementPresentation = memo(function DesignerElementPresentation({
  elementId,
  element,
  dragDrop,
  buttonRef,
}: {
  elementId: string
  element: FormElementInstance | null
  dragDrop: DragDropState
  buttonRef: RefObject<HTMLButtonElement | null>
}) {
  const { topRef, bottomRef, dragRef, topIsOver, bottomIsOver, isDragging } = dragDrop
  const isSelected = useIsSelected(elementId)

  if (!element) return null
  if (isDragging) return null

  const DesignerElement = FormElements[element.type].designerComponent
  const selectElement = () => designerStoreActions.setSelectedElement(element.id)

  return (
    <div
      ref={dragRef}
      data-designer-element-id={element.id}
      role="button"
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
        "group relative flex h-12 flex-col rounded-md text-foreground ring-1 ring-accent ring-inset",
        isSelected && "ring-2 ring-primary",
      )}
    >
      <div ref={topRef} className="absolute h-1/2 w-full rounded-t-md" />
      <div ref={bottomRef} className="absolute bottom-0 h-1/2 w-full rounded-b-md" />

      {topIsOver && <div className="absolute top-0 h-1.75 w-full rounded-b-none bg-primary" />}
      {bottomIsOver && (
        <div className="absolute bottom-0 h-1.75 w-full rounded-t-none bg-primary" />
      )}

      <div className="absolute top-1 right-1 hidden items-center gap-0.5 rounded-full border border-border/60 bg-background/90 px-1 py-0.5 shadow-sm/10 group-hover:flex">
        <button
          ref={buttonRef}
          className="inline-flex h-6 w-6 cursor-grab items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="Drag element"
          type="button"
        >
          <DotsSixVerticalIcon className="h-4 w-4" />
        </button>
        <Button
          className="h-6 w-6 rounded-full"
          size="icon-xs"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            designerStoreActions.removeElement(element.id)
          }}
          aria-label="Remove element"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex h-12 w-full items-center rounded-md bg-accent/40 px-3">
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  )
})
