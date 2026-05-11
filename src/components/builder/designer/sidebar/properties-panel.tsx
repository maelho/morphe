import { XIcon } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"
import { Separator } from "#/components/ui/separator"

import { FormElements } from "../../fields/registry"
import type { ElementsType } from "../../form-types"
import { designerStoreActions, useSelectedElement } from "../store"

export function PropertiesPanel() {
  const selectedElement = useSelectedElement()
  if (!selectedElement) return null

  const PropertiesForm = FormElements[selectedElement.type as ElementsType].propertiesComponent

  return (
    <div className="flex flex-col p-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/70">Element properties</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => designerStoreActions.setSelectedElement(null)}
        >
          <XIcon />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  )
}
