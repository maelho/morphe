import { useDraggable } from "@dnd-kit/react"
import { nanoid } from "nanoid"

import { SidebarMenuButton } from "#/components/ui/sidebar"
import { cn } from "#/lib/utils"

import { FormElements } from "../../fields/registry"
import type { ElementsType } from "../../form-types"
import { designerStoreActions, useDesignerElements } from "../store"

export function ElementSidebarButton({ type }: { type: ElementsType }) {
  const { label, icon: Icon } = FormElements[type].designerButtonElement
  const order = useDesignerElements()

  const { ref } = useDraggable({
    id: `designer-button-${type}`,
    data: { type, isDesignerButtonElement: true },
  })

  const handleClick = () => {
    const newElement = FormElements[type].construct(nanoid(5))
    designerStoreActions.addElement(order.length, newElement)
  }

  return (
    <SidebarMenuButton
      tooltip={label}
      data-element-type={type}
      className="cursor-grab text-muted-foreground"
      render={<button ref={ref} />}
      onClick={handleClick}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-muted/50 text-muted-foreground transition-colors",
          "size-8 group-data-[collapsible=icon]:size-9",
        )}
      >
        <Icon className="size-4 group-data-[collapsible=icon]:size-5" />
      </span>
      <span className="text-sm text-foreground">{label}</span>
    </SidebarMenuButton>
  )
}
