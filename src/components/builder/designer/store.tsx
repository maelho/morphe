import { useSelector } from "@tanstack/react-store"
import { Store } from "@tanstack/store"

import type { FormElementInstance } from "../form-types"

export type DesignerStore = {
  elements: Record<string, FormElementInstance>
  order: string[]
  selectedElementId: string | null
}

const designerStore = new Store<DesignerStore>({
  elements: {},
  order: [],
  selectedElementId: null,
})

export const designerStoreActions = {
  addElement(index: number, element: FormElementInstance) {
    designerStore.setState((state) => ({
      ...state,
      elements: { ...state.elements, [element.id]: element },
      order: [...state.order.slice(0, index), element.id, ...state.order.slice(index)],
    }))
  },

  removeElement(id: string) {
    designerStore.setState((state) => {
      const { [id]: _, ...rest } = state.elements
      return {
        ...state,
        elements: rest,
        order: state.order.filter((eid) => eid !== id),
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
      }
    })
  },

  moveElement(activeId: string, overId: string, insertAfter: boolean) {
    designerStore.setState((state) => {
      const activeIndex = state.order.indexOf(activeId)
      const overIndex = state.order.indexOf(overId)
      if (activeIndex === -1 || overIndex === -1 || activeId === overId) return state

      const next = [...state.order]
      next.splice(activeIndex, 1)
      const baseIndex = activeIndex < overIndex ? overIndex - 1 : overIndex
      next.splice(insertAfter ? baseIndex + 1 : baseIndex, 0, activeId)

      return { ...state, order: next }
    })
  },

  updateElement(id: string, element: FormElementInstance) {
    designerStore.setState((state) => {
      if (!state.elements[id]) return state
      return {
        ...state,
        elements: { ...state.elements, [id]: element },
      }
    })
  },

  clearElements() {
    designerStore.setState((state) => ({
      ...state,
      elements: {},
      order: [],
      selectedElementId: null,
    }))
  },

  setElements(elements: FormElementInstance[]) {
    designerStore.setState((state) => {
      const normalized: Record<string, FormElementInstance> = {}
      const order: string[] = []
      for (const el of elements) {
        normalized[el.id] = el
        order.push(el.id)
      }
      return { ...state, elements: normalized, order }
    })
  },

  setSelectedElement(id: string | null) {
    designerStore.setState((state) => ({ ...state, selectedElementId: id }))
  },
}

export function useDesignerElements() {
  return useSelector(designerStore, (s) => s.order)
}

export function useSelectedElement() {
  return useSelector(designerStore, (s) =>
    s.selectedElementId ? (s.elements[s.selectedElementId] ?? null) : null,
  )
}

export function useDesignerElement(id: string | null) {
  return useSelector(designerStore, (s) => (id ? (s.elements[id] ?? null) : null))
}

export function useIsSelected(id: string) {
  return useSelector(designerStore, (s) => s.selectedElementId === id)
}
