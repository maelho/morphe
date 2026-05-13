import { useSelector } from "@tanstack/react-store"
import { Store } from "@tanstack/store"

import type { FormElementInstance } from "../form-types"

export type DesignerStore = {
  elements: Record<string, FormElementInstance>
  order: string[]
  selectedElementId: string | null
  editingElementId: string | null
}

export const designerStore = new Store<DesignerStore>({
  elements: {},
  order: [],
  selectedElementId: null,
  editingElementId: null,
})

function clampToExisting(
  id: string | null,
  elements: Record<string, FormElementInstance>,
): string | null {
  return id && elements[id] ? id : null
}

export const designerStoreActions = {
  addElement(index: number, element: FormElementInstance) {
    if (process.env.NODE_ENV === "development" && designerStore.state.elements[element.id]) {
      console.warn(`[designerStore] addElement: duplicate id "${element.id}" — skipping`)
    }
    if (designerStore.state.elements[element.id]) return

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
        editingElementId: state.editingElementId === id ? null : state.editingElementId,
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
      next.splice(insertAfter ? overIndex + 1 : overIndex, 0, activeId)

      return { ...state, order: next }
    })
  },

  updateElement(id: string, element: FormElementInstance) {
    if (process.env.NODE_ENV === "development" && !designerStore.state.elements[id]) {
      console.warn(`[designerStore] updateElement: unknown id "${id}" — skipping`)
    }

    designerStore.setState((state) => {
      if (!state.elements[id]) return state
      return { ...state, elements: { ...state.elements, [id]: element } }
    })
  },

  clearElements() {
    designerStore.setState((state) => ({
      ...state,
      elements: {},
      order: [],
      selectedElementId: null,
      editingElementId: null,
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

      return {
        ...state,
        elements: normalized,
        order,
        selectedElementId: clampToExisting(state.selectedElementId, normalized),
        editingElementId: clampToExisting(state.editingElementId, normalized),
      }
    })
  },

  setSelectedElement(id: string | null) {
    designerStore.setState((state) => ({ ...state, selectedElementId: id }))
  },

  setEditingElement(id: string | null) {
    designerStore.setState((state) => ({ ...state, editingElementId: id }))
  },

  openProperties(id: string) {
    designerStore.setState((state) => ({
      ...state,
      selectedElementId: id,
      editingElementId: id,
    }))
  },

  closeProperties({ deselect = false }: { deselect?: boolean } = {}) {
    designerStore.setState((state) => ({
      ...state,
      editingElementId: null,
      ...(deselect ? { selectedElementId: null } : {}),
    }))
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

export function useEditingElement() {
  return useSelector(designerStore, (s) =>
    s.editingElementId ? (s.elements[s.editingElementId] ?? null) : null,
  )
}

export function useEditingElementId() {
  return useSelector(designerStore, (s) => s.editingElementId)
}
