import { FormElements } from "../../fields/registry"
import type { ElementsType } from "../../form-types"
import { useSelectedElement } from "../store"

export function PropertiesPanel() {
  const selectedElement = useSelectedElement()
  if (!selectedElement) return null

  const PropertiesForm = FormElements[selectedElement.type as ElementsType].propertiesComponent

  return <PropertiesForm elementInstance={selectedElement} />
}
