import { useDroppable } from "@dnd-kit/react"

import { ScrollArea } from "#/components/ui/scroll-area"
import { cn } from "#/lib/utils"

import { DropAreaContent } from "./drop-area"
import { PropertiesSidebar } from "./sidebar/properties-sidebar"
import { DesignerSidebar } from "./sidebar/shell"
import { designerStore, useDesignerOrder } from "./store"
import { useDesignerDragDrop } from "./use-drag-drop"

export function Designer() {
  const elementOrder = useDesignerOrder()
  useDesignerDragDrop()

  const { ref, isDropTarget } = useDroppable({
    id: "designer-drop-area",
    data: { isDesignerDropArea: true },
  })

  const handleDeselect = () => {
    designerStore.actions.setSelectedElement(null)
    designerStore.actions.closeProperties()
  }

  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-background">
        <DesignerSidebar />
      </aside>

      <div
        role="presentation"
        onClick={handleDeselect}
        onKeyDown={(e) => e.key === "Escape" && handleDeselect()}
        className="flex flex-1 justify-center overflow-hidden p-8"
      >
        <ScrollArea
          ref={ref}
          className={cn(
            "h-full min-h-125 w-full max-w-xl rounded-2xl border border-border/70 bg-card/80 shadow-xs/5 transition-all duration-300",
            isDropTarget && "border-foreground/30 bg-card/90",
          )}
        >
          <DropAreaContent elementOrder={elementOrder} isDropTarget={isDropTarget} />
        </ScrollArea>
      </div>
      <aside className="flex w-96 shrink-0 flex-col overflow-hidden border-l border-border bg-background">
        <PropertiesSidebar />
      </aside>
    </div>
  )
}
