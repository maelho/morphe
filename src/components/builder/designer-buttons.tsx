import { useDraggable } from "@dnd-kit/react"

import { Button } from "#/components/ui/button"

import type { FormElement } from "./types/elements"

export function DesignerSidebarButtonElements({ formElement }: { formElement: FormElement }) {
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
      ref={ref}
      variant={"outline"}
      className={`flex h-30 w-30 cursor-grab flex-col gap-2${isDragging ? " ring-2 ring-purple-200" : ""}`}
    >
      <Icon className="h-8 w-8 cursor-grab text-primary" />
      <p className="text-xs">{label}</p>
    </Button>
  )
}

export function DesignerSidebarButtonElementsDragOverlay({
  formElement,
}: {
  formElement: FormElement
}) {
  const { label, icon: Icon } = formElement.designerButtonElement
  return (
    <Button variant={"outline"} className="flex h-30 w-30 cursor-grab flex-col gap-2">
      <Icon className="h-8 w-8 cursor-grab text-primary" />
      <p className="text-xs">{label}</p>
    </Button>
  )
}
