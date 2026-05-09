import { createContext, use, useState, useCallback, type ReactNode } from "react"

import type { FormElementInstance } from "./types/elements"

type DesignerContextType = {
  elements: FormElementInstance[]
  addElement: (index: number, element: FormElementInstance) => void
  removeElement: (id: string) => void
  updateElement: (id: string, element: FormElementInstance) => void
  clearElements: () => void
  selectedElement: FormElementInstance | null
  setSelectedElement: (element: FormElementInstance | null) => void
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export function useDesigner(): DesignerContextType {
  const ctx = use(DesignerContext)
  if (!ctx) {
    throw new Error("useDesigner must be used within <DesignerContextProvider>")
  }
  return ctx
}

export function DesignerContextProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<FormElementInstance[]>([])
  const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null)

  const addElement = useCallback((index: number, element: FormElementInstance) => {
    setElements((prev) => [...prev.slice(0, index), element, ...prev.slice(index)])
  }, [])

  const removeElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id))
  }, [])

  const updateElement = useCallback((id: string, element: FormElementInstance) => {
    setElements((prev) => prev.map((el) => (el.id === id ? element : el)))
  }, [])

  const clearElements = useCallback(() => setElements([]), [])

  const handleSetSelectedElement = useCallback(
    (element: FormElementInstance | null) => setSelectedElement(element),
    [],
  )

  return (
    <DesignerContext
      value={{
        elements,
        addElement,
        removeElement,
        updateElement,
        clearElements,
        selectedElement,
        setSelectedElement: handleSetSelectedElement,
      }}
    >
      {children}
    </DesignerContext>
  )
}
