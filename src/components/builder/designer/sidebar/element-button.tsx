import { useDraggable } from "@dnd-kit/react"

import { cn } from "#/lib/utils"

import type { FormElement } from "../../form-types"

export function ElementButton({
  formElement,
  isDragOverlay = false,
}: {
  formElement: FormElement
  isDragOverlay?: boolean
}) {
  const { label, icon: Icon } = formElement.designerButtonElement

  const { ref, isDragging } = useDraggable({
    id: `designer-button-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerButtonElement: true,
    },
  })

  return (
    <button
      ref={isDragOverlay ? undefined : ref}
      type="button"
      className={cn(
        "flex h-8 w-full cursor-grab items-center gap-2 rounded-md px-2 text-sm hover:bg-accent",
        isDragging && "ring-2 ring-purple-200",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="text-xs">{label}</span>
    </button>
  )
}
