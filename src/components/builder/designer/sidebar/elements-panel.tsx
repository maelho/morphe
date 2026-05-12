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
      <p className="text-sm text-foreground/70">Drag and drop elements</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 place-items-center gap-2 md:grid-cols-2">
        <p className="col-span-1 my-2 place-self-start text-sm text-muted-foreground md:col-span-2">
          Layout elements
        </p>
        {layoutElements.map((type) => (
          <ElementButton key={type} formElement={FormElements[type]} />
        ))}
        <p className="col-span-1 my-2 place-self-start text-sm text-muted-foreground md:col-span-2">
          Input elements
        </p>
        {inputElements.map((type) => (
          <ElementButton key={type} formElement={FormElements[type]} />
        ))}
      </div>
    </div>
  )
}
