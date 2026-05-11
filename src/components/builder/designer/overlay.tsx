import { DragOverlay } from "@dnd-kit/react"

import { FormElements } from "../fields/registry"
import type { ElementsType } from "../form-types"
import { ElementButton } from "./sidebar/element-button"
import { useDesignerElements } from "./store"

export function DragOverlayWrapper() {
  const elements = useDesignerElements()

  return (
    <DragOverlay>{(source) => <OverlayContent source={source} elements={elements} />}</DragOverlay>
  )
}

function OverlayContent({
  source,
  elements,
}: {
  source: { data?: Record<string, unknown> }
  elements: ReturnType<typeof useDesignerElements>
}) {
  if (source.data?.isDesignerButtonElement) {
    const type = source.data.type as ElementsType
    return <ElementButton formElement={FormElements[type]} isDragOverlay />
  }

  if (source.data?.isDesignerElement) {
    const element = elements.find((el) => el.id === source.data?.elementId)
    if (!element) return <div>Element not found</div>

    const DesignerElement = FormElements[element.type as ElementsType].designerComponent
    return (
      <div className="pointer-events-none flex h-30 w-full rounded-md border bg-accent px-4 py-2 opacity-80">
        <DesignerElement elementInstance={element} />
      </div>
    )
  }

  return null
}
