import { DesignerElementWrapper } from "./element-wrapper"

export function DropAreaContent({
  elementOrder,
  isDropTarget,
}: {
  elementOrder: string[]
  isDropTarget: boolean
}) {
  if (elementOrder.length === 0 && !isDropTarget) {
    return (
      <div className="flex h-full min-h-60 w-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <p className="text-lg font-medium italic">Your form is empty</p>
        <p className="text-sm">Drag elements from the sidebar to start building.</p>
        <div className="mt-4 h-24 w-full rounded-xl border border-dashed border-border/70 bg-background/40" />
      </div>
    )
  }
  if (elementOrder.length === 0 && isDropTarget) {
    return (
      <div className="w-full p-4">
        <div className="h-30 rounded-lg border border-foreground/20 bg-accent/40" />
      </div>
    )
  }
  return (
    <div className="flex w-full flex-col gap-3 p-5">
      {elementOrder.map((elementId) => (
        <DesignerElementWrapper key={elementId} elementId={elementId} />
      ))}
    </div>
  )
}
