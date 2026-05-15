import { XIcon } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import { Drawer, DrawerClose, DrawerPanel, DrawerPopup, DrawerTitle } from "#/components/ui/drawer"
import { useIsMobile } from "#/hooks/use-media-query"

import { PropertiesPanel } from "./properties-panel"
import { designerStore, useEditingElement } from "./store"

export function DesignerInspector() {
  const anchorElement = useEditingElement()
  const isMobile = useIsMobile()

  if (!isMobile) {
    return null
  }

  return (
    <Drawer
      open={Boolean(anchorElement)}
      onOpenChange={(open) => {
        if (!open) designerStore.actions.closeProperties()
      }}
      position="bottom"
    >
      <DrawerPopup
        showBar
        className="bg-background"
        data-inspector="properties"
        portalProps={{ keepMounted: true }}
      >
        <div className="flex items-center justify-between border-b border-border/50 px-6 pt-4 pb-3">
          <DrawerTitle>Properties</DrawerTitle>
          <DrawerClose render={<Button size="icon" variant="ghost" />} aria-label="Close inspector">
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
