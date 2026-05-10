import { useSelectedElement } from "../designer-store"
import { FormElementsSidebar } from "./form-elements"
import { PropertiesFormSidebar } from "./form-properties"

export function DesignerSidebar() {
  const selectedElement = useSelectedElement()

  return (
    <aside className="flex h-full w-100 max-w-100 grow flex-col gap-2 overflow-y-auto border-l-2 border-muted bg-background p-4">
      {!selectedElement ? <FormElementsSidebar /> : <PropertiesFormSidebar />}
    </aside>
  )
}
