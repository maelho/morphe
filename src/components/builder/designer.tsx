import { useDragDropMonitor, useDroppable, type DragEndEvent } from "@dnd-kit/react"
import { nanoid } from "nanoid"

import { cn } from "#/lib/utils"

import { DesignerElementWrapper } from "./designer-element-wrapper"
import { DesignerSidebar } from "./designer-sidebar"
import { designerStoreActions, useDesignerElements } from "./designer-store"
import { FormElements } from "./elements"
import type { ElementsType } from "./types/elements"

export function Designer() {
  const elements = useDesignerElements()

  const { ref, isDropTarget } = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  })

  useDragDropMonitor({
    onDragEnd(event: DragEndEvent) {
      const { source, target } = event.operation

      if (!source || !target) return

      const sourceData = source.data
      const targetData = target.data

      const isDesignerButtonElement = sourceData?.isDesignerButtonElement
      const isDroppingOverDesignerDropArea = targetData?.isDesignerDropArea

      if (isDesignerButtonElement && isDroppingOverDesignerDropArea) {
        const type = sourceData?.type as ElementsType
        const newElement = FormElements[type].construct(nanoid(5))

        designerStoreActions.addElement(elements.length, newElement)
        return
      }

      const isDroppingOverDesignerElement =
        targetData?.isTopHalfDesignerElement || targetData?.isBottomHalfDesignerElement

      if (isDesignerButtonElement && isDroppingOverDesignerElement) {
        const type = sourceData?.type as ElementsType
        const newElement = FormElements[type].construct(nanoid(5))

        const overId = targetData?.elementId
        const overElementIndex = elements.findIndex((el) => el.id === overId)

        if (overElementIndex === -1) throw new Error("element not found")

        let indexForNewElement = overElementIndex
        if (targetData?.isBottomHalfDesignerElement) {
          indexForNewElement = overElementIndex + 1
        }

        designerStoreActions.addElement(indexForNewElement, newElement)
        return
      }
      const isDraggingDesignerElement = sourceData?.isDesignerElement

      if (isDraggingDesignerElement && isDroppingOverDesignerElement) {
        const activeId = sourceData?.elementId
        const overId = targetData?.elementId

        const activeElementIndex = elements.findIndex((el) => el.id === activeId)
        const overElementIndex = elements.findIndex((el) => el.id === overId)

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("element not found")
        }

        const activeElement = { ...elements[activeElementIndex] }
        designerStoreActions.removeElement(activeId)

        let indexForNewElement = overElementIndex
        if (targetData?.isBottomHalfDesignerElement) {
          indexForNewElement = overElementIndex + 1
        }

        designerStoreActions.addElement(indexForNewElement, activeElement)
      }
    },
  })

  return (
    <div className="flex h-full w-full">
      <div className="w-full p-4">
        <div
          ref={ref}
          className={cn(
            "m-auto flex h-full max-w-230 flex-1 grow flex-col items-center justify-start overflow-y-auto rounded-xl bg-background",
            isDropTarget ? "ring-2 ring-purple-200" : "",
          )}
        >
          {!isDropTarget && elements.length === 0 ? (
            <p className="flex grow items-center text-3xl font-bold text-muted-foreground">
              Drop here
            </p>
          ) : null}

          {isDropTarget && elements.length === 0 ? (
            <div className="w-full p-4">
              <div className="h-30 rounded-md bg-purple-200"></div>
            </div>
          ) : null}

          {elements.length > 0 ? (
            <div className="texr-has-background flex w-full flex-col gap-2 p-4">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  )
}
