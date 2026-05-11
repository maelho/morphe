import { useSelectedElement } from "../store"
import { ElementsPanel } from "./elements-panel"
import { PropertiesPanel } from "./properties-panel"

export function DesignerSidebar() {
  const selectedElement = useSelectedElement()
  return (
    <aside className="flex h-full w-100 max-w-100 grow flex-col gap-2 overflow-y-auto border-l-2 border-muted bg-background p-4">
      {selectedElement ? <PropertiesPanel /> : <ElementsPanel />}
    </aside>
  )
}
