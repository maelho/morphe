import { useDraggable, useDroppable } from "@dnd-kit/react"

import type { FormElementInstance } from "../form-types"

export function useElementDragDrop(element: FormElementInstance) {
  const { ref: topRef, isDropTarget: topIsOver } = useDroppable({
    id: `designer-element-${element.id}-top-half`,
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  })

  const { ref: bottomRef, isDropTarget: bottomIsOver } = useDroppable({
    id: `designer-element-${element.id}-bottom-half`,
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: false,
    },
  })

  const { ref: dragRef, isDragging } = useDraggable({
    id: `designer-element-${element.id}-drag-handler`,
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  })

  return { topRef, bottomRef, dragRef, topIsOver, bottomIsOver, isDragging }
}
