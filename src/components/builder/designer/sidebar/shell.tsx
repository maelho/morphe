import { FloppyDiskIcon } from "@phosphor-icons/react"
import { PanelLeftIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "#/components/ui/sidebar"

import { inputElements, layoutElements } from "../../fields/registry"
import { designerStore } from "../store"
import { ElementSidebarButton } from "./sidebar-button"

export function DesignerSidebar({ formName }: { formName: string }) {
  const { open } = useSidebar()

  const handleSave = () => {
    const state = designerStore.state
    console.log("Save/Publish:", {
      formName,
      elements: state.elements,
      order: state.order,
    })
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2">
          {open && (
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium">{formName}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            {open && (
              <Button size="sm" variant="ghost" onClick={handleSave}>
                <FloppyDiskIcon className="size-4" />
                <span className="text-xs">Save</span>
              </Button>
            )}
            <SidebarTrigger>
              <PanelLeftIcon className="size-4" />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Layout</SidebarGroupLabel>
          <SidebarMenu>
            {layoutElements.map((type) => (
              <SidebarMenuItem key={type}>
                <ElementSidebarButton type={type} />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Inputs</SidebarGroupLabel>
          <SidebarMenu>
            {inputElements.map((type) => (
              <SidebarMenuItem key={type}>
                <ElementSidebarButton type={type} />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {open && (
          <div className="px-2 py-1 text-xs text-muted-foreground">
            Click or drag to add elements
          </div>
        )}
      </SidebarFooter>
    </>
  )
}
