import { useDraggable, useDroppable } from "@dnd-kit/react"
import { useMemo } from "react"

import type { ElementsType } from "../form-types"

export function useElementDragDrop(elementId: string, type?: ElementsType, disabled?: boolean) {
  const topDroppableConfig = useMemo(
    () => ({
      id: `designer-element-${elementId}-top-half`,
      data: {
        type,
        elementId,
        isTopHalfDesignerElement: true,
        isBottomHalfDesignerElement: false,
      },
    }),
    [elementId, type],
  )

  const bottomDroppableConfig = useMemo(
    () => ({
      id: `designer-element-${elementId}-bottom-half`,
      data: {
        type,
        elementId,
        isTopHalfDesignerElement: false,
        isBottomHalfDesignerElement: true,
      },
    }),
    [elementId, type],
  )

  const draggableConfig = useMemo(
    () => ({
      id: `designer-element-${elementId}-drag-handler`,
      data: { type, elementId, isDesignerElement: true },
      disabled,
    }),
    [elementId, type, disabled],
  )

  const { ref: topRef, isDropTarget: topIsOver } = useDroppable(topDroppableConfig)
  const { ref: bottomRef, isDropTarget: bottomIsOver } = useDroppable(bottomDroppableConfig)
  const { ref: dragRef, isDragging } = useDraggable(draggableConfig)

  return { topRef, bottomRef, dragRef, topIsOver, bottomIsOver, isDragging }
}
