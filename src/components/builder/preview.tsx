import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { useDesignerElement, useDesignerElements } from "./designer/store"
import { FormElements } from "./fields/registry"

export default function FormBuilderPreviewButton() {
  const elementOrder = useDesignerElements()
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Preview</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Form preview</DialogTitle>
          <DialogDescription>Preview how your form will look to users.</DialogDescription>
        </DialogHeader>
        <DialogPanel>
          {elementOrder.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add an element to preview the form.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {elementOrder.map((el) => (
                <RenderFormComponent key={el} id={el} />
              ))}
            </div>
          )}
        </DialogPanel>
      </DialogContent>
    </Dialog>
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
