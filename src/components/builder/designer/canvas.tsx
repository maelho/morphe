import { useDroppable } from "@dnd-kit/react"

import { Sidebar, SidebarInset, SidebarProvider } from "#/components/ui/sidebar"
import { cn } from "#/lib/utils"

import { DropAreaContent } from "./drop-area"
import { DesignerInspector } from "./inspector"
import { DesignerSidebar } from "./sidebar/shell"
import { designerStoreActions, useDesignerElements } from "./store"
import { useDesignerDragDrop } from "./use-drag-drop"

export function Designer({ formName }: { formName: string }) {
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
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="inset">
        <DesignerSidebar formName={formName} />
      </Sidebar>
      <SidebarInset className="bg-background">
        <div className="flex h-full w-full min-w-0 flex-col overflow-hidden">
          <div className="relative h-full w-full grow overflow-y-auto p-4 md:p-8">
            <div
              ref={ref}
              role="presentation"
              className={cn(
                "m-auto flex min-h-full w-full max-w-xl flex-1 grow flex-col items-center justify-start rounded-2xl border border-border/70 bg-card/80 p-8 shadow-xs/5 transition-all duration-300",
                isDropTarget && "border-foreground/30 bg-card/90",
              )}
              onClick={handleDeselect}
              onKeyDown={(e) => e.key === "Escape" && handleDeselect()}
            >
              <DropAreaContent elementOrder={elementOrder} isDropTarget={isDropTarget} />
            </div>
          </div>
        </div>
      </SidebarInset>
      <DesignerInspector />
    </SidebarProvider>
  )
}
