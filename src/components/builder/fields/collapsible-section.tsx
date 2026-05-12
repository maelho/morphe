import { CaretDownIcon } from "@phosphor-icons/react"
import type React from "react"

import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "#/components/ui/collapsible"

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
  className,
}: CollapsibleSectionProps): React.ReactElement {
  return (
    <Collapsible defaultOpen={defaultOpen} className={className}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/80">
        <span>{title}</span>
        <CaretDownIcon className="size-4 transition-transform duration-200 data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsiblePanel className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="space-y-3 pb-2">{children}</div>
      </CollapsiblePanel>
    </Collapsible>
  )
}
