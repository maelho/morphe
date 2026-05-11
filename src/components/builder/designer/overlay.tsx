import { DragOverlay } from "@dnd-kit/react"

import { FormElements } from "../fields/registry"
import type { ElementsType } from "../form-types"
import { ElementButton } from "./sidebar/element-button"
import { useDesignerElement, useDesignerElements } from "./store"

export function DragOverlayWrapper() {
  const elementOrder = useDesignerElements()

  return (
    <DragOverlay>
      {(source) => <OverlayContent source={source} elementOrder={elementOrder} />}
    </DragOverlay>
  )
}

function OverlayContent({
  source,
  elementOrder,
}: {
  source: { data?: Record<string, unknown> }
  elementOrder: ReturnType<typeof useDesignerElements>
}) {
  const elementId = (source.data?.elementId as string | undefined) ?? null
  const element = useDesignerElement(elementId)

  if (source.data?.isDesignerButtonElement) {
    const type = source.data.type as ElementsType
    return <ElementButton formElement={FormElements[type]} isDragOverlay />
  }

  if (source.data?.isDesignerElement) {
    if (!elementId || !element || !elementOrder.includes(elementId))
      return <div>Element not found</div>

    const DesignerElement = FormElements[element.type as ElementsType].designerComponent
    return (
      <div className="pointer-events-none flex h-30 w-full rounded-md border bg-accent px-4 py-2 opacity-80">
        <DesignerElement elementInstance={element} />
      </div>
    )
  }

  return null
}
