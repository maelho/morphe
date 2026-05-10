import { useSelector } from "@tanstack/react-store"
import { Store } from "@tanstack/store"

import type { FormElementInstance } from "./types/elements"

export type DesignerStore = {
  elements: FormElementInstance[]
  selectedElement: FormElementInstance | null
}

const designerStore = new Store<DesignerStore>({
  elements: [],
  selectedElement: null,
})

export const designerStoreActions = {
  addElement(index: number, element: FormElementInstance) {
    designerStore.setState((state) => ({
      ...state,
      elements: [...state.elements.slice(0, index), element, ...state.elements.slice(index)],
    }))
  },

  removeElement(id: string) {
    designerStore.setState((state) => ({
      ...state,
      elements: state.elements.filter((e) => e.id != id),
    }))
  },

  updateElement(id: string, element: FormElementInstance) {
    designerStore.setState((state) => ({
      ...state,
      elements: state.elements.map((e) => (e.id === id ? element : e)),
    }))
  },

  clearElements() {
    designerStore.setState((state) => ({
      ...state,
      elements: [],
    }))
  },

  setSelectedElement(element: FormElementInstance | null) {
    designerStore.setState((state) => ({
      ...state,
      selectedElement: element,
    }))
  },
}

export function useDesignerElements() {
  return useSelector(designerStore, (s) => s.elements)
}

export function useSelectedElement() {
  return useSelector(designerStore, (s) => s.selectedElement)
}
