import { FormElements } from "../fields/registry"
import type { ElementsType, FormElementInstance } from "../form-types"
import { useEditingElement, useSelectedElement } from "./store"

export function PropertiesPanel({ element }: { element?: FormElementInstance }) {
  const selectedElement = useSelectedElement()
  const editingElement = useEditingElement()
  const targetElement = element ?? editingElement ?? selectedElement

  if (!targetElement) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <span>Select an element</span>
        <span className="text-xs">Its properties appear here.</span>
      </div>
    )
  }

  const PropertiesForm = FormElements[targetElement.type as ElementsType].propertiesComponent

  return <PropertiesForm elementInstance={targetElement} />
}
