import { useDraggable } from "@dnd-kit/react"

import { Button } from "#/components/ui/button"
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
    <Button
      ref={isDragOverlay ? undefined : ref}
      variant="outline"
      className={cn(
        "flex h-30 w-30 cursor-grab flex-col gap-2",
        isDragging && "ring-2 ring-purple-200",
      )}
    >
      <Icon className="h-8 w-8 cursor-grab text-primary" />
      <p className="text-xs">{label}</p>
    </Button>
  )
}
