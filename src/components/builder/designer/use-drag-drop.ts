import { useDragDropMonitor } from "@dnd-kit/react"
import type { DragEndEvent } from "@dnd-kit/react"
import { nanoid } from "nanoid"

import { FormElements } from "../fields/registry"
import type { ElementsType, FormElementInstance } from "../form-types"
import { designerStoreActions } from "./store"

export function useDesignerDragDrop(elements: FormElementInstance[]) {
  useDragDropMonitor({
    onDragEnd(event: DragEndEvent) {
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
        designerStoreActions.addElement(elements.length, newElement)
        return
      }

      if (isButton && overEl) {
        const newElement = FormElements[src.type as ElementsType].construct(nanoid(5))
        const overIndex = elements.findIndex((el) => el.id === tgt.elementId)
        if (overIndex === -1) throw new Error("element not found")
        const index = tgt.isBottomHalfDesignerElement ? overIndex + 1 : overIndex
        designerStoreActions.addElement(index, newElement)
        return
      }

      if (isElement && overEl) {
        const activeIndex = elements.findIndex((el) => el.id === src.elementId)
        const overIndex = elements.findIndex((el) => el.id === tgt.elementId)
        if (activeIndex === -1 || overIndex === -1) throw new Error("element not found")
        const activeElement = { ...elements[activeIndex] }
        designerStoreActions.removeElement(src.elementId)
        const index = tgt.isBottomHalfDesignerElement ? overIndex + 1 : overIndex
        designerStoreActions.addElement(index, activeElement)
      }
    },
  })
}
