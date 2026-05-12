import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from "../ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "../ui/empty"
import { ScrollArea } from "../ui/scroll-area"
import { useDesignerElement, useDesignerElements } from "./designer/store"
import { FormElements } from "./fields/registry"

export function FormBuilderPreviewPanel() {
  const elementOrder = useDesignerElements()

  return (
    <Card className="h-full rounded-none border-none before:rounded-none">
      <CardHeader className="border-b">
        <CardTitle className="text-base">Live preview</CardTitle>
        <CardDescription>Updates as you build</CardDescription>
      </CardHeader>
      <CardPanel className="flex-1 p-0">
        <ScrollArea className="h-full">
          {elementOrder.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>Start building</EmptyTitle>
                <EmptyDescription>Drag an element to see a live preview here.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent />
            </Empty>
          ) : (
            <div className="flex flex-col gap-3 p-6">
              {elementOrder.map((el) => (
                <RenderFormComponent key={el} id={el} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardPanel>
    </Card>
  )
}

function RenderFormComponent({ id }: { id: string }) {
  const element = useDesignerElement(id)

  if (!element) {
    return null
  }

  const FormComponent = FormElements[element.type].formComponent
  return <FormComponent elementInstance={element} />
}
