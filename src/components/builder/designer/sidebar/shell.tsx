import { inputElements, layoutElements } from "../../fields/registry"
import { ElementSidebarButton } from "./sidebar-button"

export function DesignerSidebar() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          Text elements
        </p>
        <div className="grid grid-cols-2 gap-2">
          {layoutElements.map((type) => (
            <ElementSidebarButton key={type} type={type} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          Multiple choice
        </p>
        <div className="grid grid-cols-2 gap-2">
          {inputElements.map((type) => (
            <ElementSidebarButton key={type} type={type} />
          ))}
        </div>
      </div>
    </div>
  )
}
