import { PencilSimpleIcon } from "@phosphor-icons/react"

import { PropertiesPanel } from "../properties-panel"
import { useEditingElement } from "../store"

export function PropertiesSidebar() {
  const editingElement = useEditingElement()

  if (!editingElement) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
        <PencilSimpleIcon className="size-8 opacity-30" />
        <div className="flex flex-col gap-1">
          <span className="font-medium text-foreground/70">No element selected</span>
          <span className="text-xs">Click on an element to edit its properties</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <PencilSimpleIcon className="size-4 text-muted-foreground" weight="bold" />
        <span className="text-sm font-medium">Properties</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
        <PropertiesPanel element={editingElement} />
      </div>
    </div>
  )
}
