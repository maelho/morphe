import { useSelector } from "@tanstack/react-store"
import { shallow } from "@tanstack/store"
import { Store, type StoreActionsFactory } from "@tanstack/store"

import type { FormElementInstance } from "../form-types"

const MAX_HISTORY = 50

type DesignerState = {
  elements: Record<string, FormElementInstance>
  order: string[]
  formId: string | null
  formName: string | null
}

type UIState = {
  selectedElementId: string | null
  editingElementId: string | null
}

type HistoryState = {
  past: DesignerState[]
  future: DesignerState[]
}

export type DesignerStore = DesignerState & UIState & HistoryState

export type DesignerStoreActions = {
  addElement: (index: number, element: FormElementInstance) => void
  removeElement: (id: string) => void
  moveElement: (activeId: string, overId: string, insertAfter: boolean) => void
  updateElement: (id: string, element: FormElementInstance) => void
  clearElements: () => void
  setElements: (elements: FormElementInstance[]) => void
  undo: () => void
  redo: () => void
  setSelectedElement: (id: string | null) => void
  setEditingElement: (id: string | null) => void
  openProperties: (id: string) => void
  closeProperties: (opts?: { deselect?: boolean }) => void
  setFormInfo: (formId: string | null, formName: string | null) => void
  clearFormInfo: () => void
}

const initialState: DesignerStore = {
  elements: {},
  order: [],
  selectedElementId: null,
  editingElementId: null,
  formId: null,
  formName: null,
  past: [],
  future: [],
}

function createSnapshot(state: DesignerStore): DesignerState {
  return {
    elements: { ...state.elements },
    order: [...state.order],
    formId: state.formId,
    formName: state.formName,
  }
}

function clampToExisting(
  id: string | null,
  elements: Record<string, FormElementInstance>,
): string | null {
  return id !== null && id in elements ? id : null
}

function pushHistory(past: DesignerState[], snapshot: DesignerState): DesignerState[] {
  return past.length >= MAX_HISTORY ? [...past.slice(1), snapshot] : [...past, snapshot]
}

function withHistory(
  setState: Store<DesignerStore>["setState"],
  updater: (state: DesignerStore) => DesignerState | null | void,
) {
  setState((state) => {
    const next = updater(state)
    if (next == null) return state

    return {
      ...state,
      ...next,
      past: pushHistory(state.past, createSnapshot(state)),
      future: [],
    }
  })
}

const actionsFactory: StoreActionsFactory<DesignerStore, DesignerStoreActions> = ({
  setState,
}) => ({
  addElement(index, element) {
    withHistory(setState, (state) => {
      if (state.elements[element.id]) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[designerStore] duplicate element id "${element.id}"`)
        }
        return null
      }

      const order = [...state.order]
      order.splice(index, 0, element.id)

      return {
        ...state,
        elements: { ...state.elements, [element.id]: element },
        order,
      }
    })
  },

  removeElement(id) {
    withHistory(setState, (state) => {
      if (!state.elements[id]) return null

      const { [id]: _, ...elements } = state.elements

      return {
        ...state,
        elements,
        order: state.order.filter((x) => x !== id),
        // Keep UI state consistent — clear pointers to the removed element.
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        editingElementId: state.editingElementId === id ? null : state.editingElementId,
      }
    })
  },

  moveElement(activeId, overId, insertAfter) {
    withHistory(setState, (state) => {
      const activeIndex = state.order.indexOf(activeId)
      const overIndex = state.order.indexOf(overId)

      if (activeIndex === -1 || overIndex === -1 || activeId === overId) return null

      const order = [...state.order]
      order.splice(activeIndex, 1)

      let targetIndex = insertAfter ? overIndex + 1 : overIndex
      if (activeIndex < targetIndex) targetIndex -= 1

      order.splice(targetIndex, 0, activeId)

      return { ...state, order }
    })
  },

  updateElement(id, element) {
    withHistory(setState, (state) => {
      const current = state.elements[id]

      if (!current) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[designerStore] unknown element "${id}"`)
        }
        return null
      }

      if (current === element) return null

      return { ...state, elements: { ...state.elements, [id]: element } }
    })
  },

  clearElements() {
    withHistory(setState, (state) => {
      if (state.order.length === 0) return null

      return {
        ...state,
        elements: {},
        order: [],
        selectedElementId: null,
        editingElementId: null,
      }
    })
  },

  setElements(elements) {
    withHistory(setState, (state) => {
      const normalized: Record<string, FormElementInstance> = {}
      const order: string[] = []

      for (const element of elements) {
        normalized[element.id] = element
        order.push(element.id)
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

  undo() {
    setState((state) => {
      if (state.past.length === 0) return state

      const previous = state.past[state.past.length - 1]
      const current = createSnapshot(state)

      return {
        ...state,
        ...previous,
        past: state.past.slice(0, -1),
        future: [current, ...state.future],
      }
    })
  },

  redo() {
    setState((state) => {
      if (state.future.length === 0) return state

      const next = state.future[0]
      const current = createSnapshot(state)

      return {
        ...state,
        ...next,
        past: pushHistory(state.past, current),
        future: state.future.slice(1),
      }
    })
  },

  setSelectedElement(id) {
    setState((state) => ({ ...state, selectedElementId: id }))
  },

  setEditingElement(id) {
    setState((state) => ({ ...state, editingElementId: id }))
  },

  openProperties(id) {
    setState((state) => ({ ...state, selectedElementId: id, editingElementId: id }))
  },

  closeProperties({ deselect = false } = {}) {
    setState((state) => ({
      ...state,
      editingElementId: null,
      selectedElementId: deselect ? null : state.selectedElementId,
    }))
  },

  setFormInfo(formId, formName) {
    setState((state) => ({ ...state, formId, formName }))
  },

  clearFormInfo() {
    setState((state) => ({ ...state, formId: null, formName: null }))
  },
})

export const designerStore = new Store<DesignerStore, DesignerStoreActions>(
  initialState,
  actionsFactory,
)

export const designerActions = designerStore.actions

export function useDesignerOrder() {
  return useSelector(designerStore, (s) => s.order)
}

export function useDesignerElements() {
  return useSelector(designerStore, (s) => s.elements)
}

export function useDesignerElement(id: string | null) {
  return useSelector(designerStore, (s) => (id ? (s.elements[id] ?? null) : null))
}

export function useSelectedElement() {
  return useSelector(designerStore, (s) =>
    s.selectedElementId ? (s.elements[s.selectedElementId] ?? null) : null,
  )
}

export function useEditingElement() {
  return useSelector(designerStore, (s) =>
    s.editingElementId ? (s.elements[s.editingElementId] ?? null) : null,
  )
}

export function useEditingElementId() {
  return useSelector(designerStore, (s) => s.editingElementId)
}

export function useIsSelected(id: string) {
  return useSelector(designerStore, (s) => s.selectedElementId === id)
}

export function useIsEditing(id: string) {
  return useSelector(designerStore, (s) => s.editingElementId === id)
}

export function useFormInfo() {
  return useSelector(designerStore, (s) => ({ formId: s.formId, formName: s.formName }), {
    compare: shallow,
  })
}

export function useCanUndo() {
  return useSelector(designerStore, (s) => s.past.length > 0)
}

export function useCanRedo() {
  return useSelector(designerStore, (s) => s.future.length > 0)
}
