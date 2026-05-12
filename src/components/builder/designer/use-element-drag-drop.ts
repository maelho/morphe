import { useDraggable, useDroppable } from "@dnd-kit/react"

import type { ElementsType } from "../form-types"

export function useElementDragDrop(elementId: string, type?: ElementsType) {
  const { ref: topRef, isDropTarget: topIsOver } = useDroppable({
    id: `designer-element-${elementId}-top-half`,
    data: {
      type,
      elementId,
      isTopHalfDesignerElement: true,
      isBottomHalfDesignerElement: false,
    },
  })

  const { ref: bottomRef, isDropTarget: bottomIsOver } = useDroppable({
    id: `designer-element-${elementId}-bottom-half`,
    data: {
      type,
      elementId,
      isTopHalfDesignerElement: false,
      isBottomHalfDesignerElement: true,
    },
  })

  const { ref: dragRef, isDragging } = useDraggable({
    id: `designer-element-${elementId}-drag-handler`,
    data: { type, elementId, isDesignerElement: true },
  })

  return { topRef, bottomRef, dragRef, topIsOver, bottomIsOver, isDragging }
}
