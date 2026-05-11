import { useDroppable } from "@dnd-kit/react"

import { cn } from "#/lib/utils"

import type { FormElementInstance } from "../form-types"
import { DesignerElementWrapper } from "./element-wrapper"
import { DesignerSidebar } from "./sidebar/shell"
import { useDesignerElements } from "./store"
import { useDesignerDragDrop } from "./use-drag-drop"

export function Designer() {
  const elements = useDesignerElements()
  useDesignerDragDrop(elements)

  const { ref, isDropTarget } = useDroppable({
    id: "designer-drop-area",
    data: { isDesignerDropArea: true },
  })

  return (
    <div className="flex h-full w-full">
      <div className="w-full p-4">
        <div
          ref={ref}
          className={cn(
            "m-auto flex h-full max-w-230 flex-1 grow flex-col items-center justify-start overflow-y-auto rounded-xl bg-background",
            isDropTarget && "ring-2 ring-purple-200",
          )}
        >
          <DropAreaContent elements={elements} isDropTarget={isDropTarget} />
        </div>
      </div>
      <DesignerSidebar />
    </div>
  )
}

function DropAreaContent({
  elements,
  isDropTarget,
}: {
  elements: FormElementInstance[]
  isDropTarget: boolean
}) {
  if (elements.length === 0 && !isDropTarget) {
    return (
      <p className="flex grow items-center text-3xl font-bold text-muted-foreground">Drop here</p>
    )
  }
  if (elements.length === 0 && isDropTarget) {
    return (
      <div className="w-full p-4">
        <div className="h-30 rounded-md bg-purple-200" />
      </div>
    )
  }
  return (
    <div className="flex w-full flex-col gap-2 p-4">
      {elements.map((element) => (
        <DesignerElementWrapper key={element.id} element={element} />
      ))}
    </div>
  )
}
