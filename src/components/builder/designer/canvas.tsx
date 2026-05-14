import { useDroppable } from "@dnd-kit/react"

import { cn } from "#/lib/utils"

import { DropAreaContent } from "./drop-area"
import { DesignerSidebar } from "./sidebar/shell"
import { PropertiesSidebar } from "./sidebar/properties-sidebar"
import { designerStoreActions, useDesignerElements } from "./store"
import { useDesignerDragDrop } from "./use-drag-drop"

export function Designer() {
  const elementOrder = useDesignerElements()
  useDesignerDragDrop()

  const { ref, isDropTarget } = useDroppable({
    id: "designer-drop-area",
    data: { isDesignerDropArea: true },
  })

  const handleDeselect = () => {
    designerStoreActions.setSelectedElement(null)
    designerStoreActions.closeProperties()
  }

  return (
    <div className="flex flex-1 w-full overflow-hidden">
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-background">
        <DesignerSidebar />
      </aside>

      <div
        role="presentation"
        onClick={handleDeselect}
        onKeyDown={(e) => e.key === "Escape" && handleDeselect()}
        className="flex flex-1 justify-center overflow-y-auto p-8"
      >
        <div
          ref={ref}
          className={cn(
            "h-200 w-full max-w-xl rounded-2xl border border-border/70 bg-card/80 p-8 shadow-xs/5 transition-all duration-300",
            isDropTarget && "border-foreground/30 bg-card/90",
          )}
        >
          <DropAreaContent elementOrder={elementOrder} isDropTarget={isDropTarget} />
        </div>
      </div>

      <aside className="w-72 shrink-0 overflow-y-auto border-l border-border bg-background">
        <PropertiesSidebar />
      </aside>
    </div>
  )
}
