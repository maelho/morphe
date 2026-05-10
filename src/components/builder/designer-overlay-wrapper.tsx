import { DragOverlay } from "@dnd-kit/react"

import { DesignerSidebarButtonElementsDragOverlay } from "./designer-buttons"
import { useDesignerElements } from "./designer-store"
import { FormElements } from "./elements"
import type { ElementsType } from "./types/elements"

export function DragOverlayWrapper() {
  const elements = useDesignerElements()

  return (
    <DragOverlay>
      {(source) => {
        if (source.data?.isDesignerButtonElement) {
          const type = source.data?.type as ElementsType
          return <DesignerSidebarButtonElementsDragOverlay formElement={FormElements[type]} />
        }

        if (source.data?.isDesignerElement) {
          const element = elements.find((el) => el.id === source.data?.elementId)
          if (!element) return <div>Element not found!</div>
          const DesignerElementComponent = FormElements[element.type].designerComponent
          return (
            <div className="pointer pointer-events-none flex h-30 w-full rounded-md border bg-accent px-4 py-2 opacity-80">
              <DesignerElementComponent elementInstance={element} />
            </div>
          )
        }

        return <div>No drag overlay</div>
      }}
    </DragOverlay>
  )
}
