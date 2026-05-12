import { useDraggable } from "@dnd-kit/react"
import { XIcon } from "@phosphor-icons/react"
import { PanelLeftIcon } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"

import { Button } from "#/components/ui/button"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "#/components/ui/collapsible"
import { Drawer, DrawerClose, DrawerPanel, DrawerPopup, DrawerTitle } from "#/components/ui/drawer"
import { Popover, PopoverPopup, PopoverTitle } from "#/components/ui/popover"
import { ScrollArea } from "#/components/ui/scroll-area"
import { useIsMobile } from "#/hooks/use-media-query"
import { cn } from "#/lib/utils"

import { FormElements } from "../../fields/registry"
import type { FormElement } from "../../form-types"
import { designerStoreActions, useSelectedElement } from "../store"
import { ElementsPanel } from "./elements-panel"
import { PropertiesPanel } from "./properties-panel"

export function DesignerSidebar() {
  return (
    <div className="flex h-full">
      <ElementRail />
      <FloatingInspectorShell />
    </div>
  )
}

function ElementRail() {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex h-full">
      <div
        className={cn(
          "flex h-full flex-col border-r border-border/60 bg-background/90 transition-[width] duration-200 ease-out",
          open ? "w-48" : "w-12",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 px-2 pt-2",
            open ? "justify-between" : "justify-center",
          )}
        >
          {open && (
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold">Elements</span>
            </div>
          )}
          <CollapsibleTrigger
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground transition-colors hover:text-foreground",
              !open && "mx-auto",
            )}
          >
            <PanelLeftIcon className={cn("h-4 w-4 transition-transform", !open && "rotate-180")} />
            <span className="sr-only">{open ? "Collapse elements" : "Expand elements"}</span>
          </CollapsibleTrigger>
        </div>
        <CollapsiblePanel className="flex-1">
          <ScrollArea className="h-full px-2 pb-2">
            <ElementsPanel />
          </ScrollArea>
        </CollapsiblePanel>
        {!open && (
          <div className="flex animate-in flex-col items-center gap-0.5 overflow-y-auto py-2 duration-200 fade-in">
            {Object.values(FormElements).map((el) => (
              <RailElementButton key={el.type} formElement={el} />
            ))}
          </div>
        )}
      </div>
    </Collapsible>
  )
}

function RailElementButton({ formElement }: { formElement: FormElement }) {
  const { icon: Icon } = formElement.designerButtonElement

  const { ref, isDragging } = useDraggable({
    id: `designer-button-rail-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerButtonElement: true,
    },
  })

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        isDragging && "ring-2 ring-purple-200",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function FloatingInspectorShell() {
  const selectedElement = useSelectedElement()
  const isMobile = useIsMobile()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const lastAnchorRef = useRef<HTMLElement | null>(null)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      designerStoreActions.setSelectedElement(null)
    }
  }

  useLayoutEffect(() => {
    if (!selectedElement) {
      if (lastAnchorRef.current !== null) {
        lastAnchorRef.current = null
        setAnchor(null)
      }
      return
    }

    const updateAnchor = () => {
      const element = document.querySelector(
        `[data-designer-element-id="${selectedElement.id}"]`,
      ) as HTMLElement | null

      if (element !== lastAnchorRef.current) {
        lastAnchorRef.current = element
        setAnchor(element)
      }
    }

    updateAnchor()

    window.addEventListener("resize", updateAnchor)
    const scrollers = document.querySelectorAll("[data-slot='scroll-area-viewport']")
    scrollers.forEach((node) => node.addEventListener("scroll", updateAnchor, { passive: true }))

    return () => {
      window.removeEventListener("resize", updateAnchor)
      scrollers.forEach((node) => node.removeEventListener("scroll", updateAnchor))
    }
  }, [selectedElement])

  if (!selectedElement) return null

  if (isMobile) {
    return (
      <Drawer open={Boolean(selectedElement)} onOpenChange={handleOpenChange} position="bottom">
        <DrawerPopup
          showBar
          className="bg-background"
          data-inspector="properties"
          portalProps={{ keepMounted: true }}
        >
          <div className="flex items-center justify-between border-b border-border/50 px-6 pt-4 pb-3">
            <DrawerTitle>Element properties</DrawerTitle>
            <DrawerClose
              render={<Button size="icon" variant="ghost" />}
              aria-label="Close inspector"
            >
              <XIcon />
            </DrawerClose>
          </div>
          <DrawerPanel className="pt-4">
            <PropertiesPanel />
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    )
  }

  return (
    <Popover open={Boolean(selectedElement && anchor)} onOpenChange={handleOpenChange}>
      <PopoverPopup
        anchor={anchor}
        side="right"
        align="center"
        sideOffset={18}
        alignOffset={0}
        className="max-h-[70vh] w-[min(22rem,90vw)] overflow-hidden border border-border/60 shadow-lg/10"
        data-inspector="properties"
        portalProps={{ keepMounted: true }}
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <PopoverTitle className="text-base font-semibold">Properties</PopoverTitle>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Close inspector"
            onClick={() => designerStoreActions.setSelectedElement(null)}
          >
            <XIcon />
          </Button>
        </div>
        <div className="mt-4">
          <PropertiesPanel />
        </div>
      </PopoverPopup>
    </Popover>
  )
}
