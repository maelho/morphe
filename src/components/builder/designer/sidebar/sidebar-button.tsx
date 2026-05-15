import { useDraggable } from "@dnd-kit/react"
import { nanoid } from "nanoid"

import { cn } from "#/lib/utils"

import { FormElements } from "../../fields/registry"
import type { ElementsType } from "../../form-types"
import { designerStore, useDesignerOrder } from "../store"

export function ElementSidebarButton({ type }: { type: ElementsType }) {
  const { label, icon: Icon } = FormElements[type].designerButtonElement
  const order = useDesignerOrder()

  const { ref } = useDraggable({
    id: `designer-button-${type}`,
    data: { type, isDesignerButtonElement: true },
  })

  const handleClick = () => {
    const newElement = FormElements[type].construct(nanoid(5))
    designerStore.actions.addElement(order.length, newElement)
  }

  return (
    <button
      ref={ref}
      data-element-type={type}
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        "h-24 w-full px-3 py-3",
        "rounded-xl border border-border bg-secondary",
        "cursor-grab active:scale-[0.97] active:cursor-grabbing",
        "hover:border-border/60 hover:bg-background",
        "transition-colors duration-100",
        "select-none",
      )}
    >
      <Icon className="size-5.5 text-muted-foreground" />
      <span className="text-xs font-normal text-foreground">{label}</span>
    </button>
  )
}
