import { useDragDropMonitor } from "@dnd-kit/react"
import type { DragEndEvent } from "@dnd-kit/react"
import { nanoid } from "nanoid"
import { useCallback } from "react"

import { FormElements } from "../fields/registry"
import type { ElementsType } from "../form-types"
import { designerStore } from "./store"

export function useDesignerDragDrop() {
  const onDragEnd = useCallback((event: DragEndEvent) => {
    const currentOrder = designerStore.state.order

    const { source, target } = event.operation
    if (!source || !target) return

    const src = source.data
    const tgt = target.data

    const isButton = src?.isDesignerButtonElement
    const isElement = src?.isDesignerElement
    const overArea = tgt?.isDesignerDropArea
    const overEl = tgt?.isTopHalfDesignerElement || tgt?.isBottomHalfDesignerElement

    if (isButton && overArea) {
      const newElement = FormElements[src.type as ElementsType].construct(nanoid(5))
      designerStore.actions.addElement(currentOrder.length, newElement)
      return
    }

    if (isButton && overEl) {
      const newElement = FormElements[src.type as ElementsType].construct(nanoid(5))
      const overIndex = currentOrder.indexOf(tgt.elementId)
      if (overIndex === -1) throw new Error("element not found")
      const index = tgt.isBottomHalfDesignerElement ? overIndex + 1 : overIndex
      designerStore.actions.addElement(index, newElement)
      return
    }

    if (isElement && overEl) {
      designerStore.actions.moveElement(
        src.elementId,
        tgt.elementId,
        tgt.isBottomHalfDesignerElement,
      )
    }
  }, [])

  useDragDropMonitor({ onDragEnd })
}
