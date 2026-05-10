import { XIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { designerStoreActions, useSelectedElement } from "../designer-store"
import { FormElements } from "../elements"

export function PropertiesFormSidebar() {
  const selectedElement = useSelectedElement()
  if (!selectedElement) return null

  const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent

  return (
    <div className="flex flex-col p-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/70">Element properties</p>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            designerStoreActions.setSelectedElement(null)
          }}
        >
          <XIcon />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  )
}
