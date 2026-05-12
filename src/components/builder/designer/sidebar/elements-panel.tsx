import { Separator } from "#/components/ui/separator"

import { FormElements } from "../../fields/registry"
import type { ElementsType } from "../../form-types"
import { ElementButton } from "./element-button"

const layoutElements: ElementsType[] = [
  "TitleField",
  "SubtitleField",
  "ParagraphField",
  "SeparatorField",
  "SpacerField",
]

const inputElements: ElementsType[] = [
  "TextField",
  "TextareaField",
  "NumberField",
  "DateField",
  "CheckboxField",
  "SelectField",
]

export function ElementsPanel() {
  return (
    <div>
      <Separator className="my-2" />
      <div className="flex flex-col gap-px">
        <p className="mt-2 mb-0.5 px-1 text-xs font-medium text-muted-foreground">Layout</p>
        {layoutElements.map((type) => (
          <ElementButton key={type} formElement={FormElements[type]} />
        ))}
        <p className="mt-2 mb-0.5 px-1 text-xs font-medium text-muted-foreground">Inputs</p>
        {inputElements.map((type) => (
          <ElementButton key={type} formElement={FormElements[type]} />
        ))}
      </div>
    </div>
  )
}
