import { CaretDownIcon } from "@phosphor-icons/react"
import type React from "react"
import { useState } from "react"

import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "#/components/ui/collapsible"
import { cn } from "#/lib/utils"

type CollapsibleSectionProps = {
  title: string
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
}

export function CollapsibleSection({
  title,
  children,
  className,
  defaultOpen = true,
}: CollapsibleSectionProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("group", className)}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/80">
        <span>{title}</span>
        <CaretDownIcon
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-data-open:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsiblePanel className="overflow-hidden">
        <div className="space-y-3 pb-2">{children}</div>
      </CollapsiblePanel>
    </Collapsible>
  )
}
