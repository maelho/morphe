import { useDraggable } from "@dnd-kit/react"

import { cn } from "#/lib/utils"

import type { FormElement } from "../form-types"

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
        "flex flex-col items-center justify-center gap-2",
        "h-24 w-full px-3 py-3",
        "rounded-xl border border-border bg-secondary",
        "cursor-grab active:cursor-grabbing",
        "transition-colors duration-100",
        "hover:border-border/60 hover:bg-background",
        "text-muted-foreground select-none hover:text-foreground",
        isDragging && !isDragOverlay && "opacity-40",
        isDragOverlay && "cursor-grabbing border-foreground/20 bg-background shadow-lg",
      )}
    >
      <Icon className="size-5.5 shrink-0" />
      <span className="text-xs font-normal">{label}</span>
    </button>
  )
}
