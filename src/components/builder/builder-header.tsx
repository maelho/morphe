import { ArrowClockwiseIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button"

import { designerStore, useCanRedo, useCanUndo, useFormInfo } from "./designer/store"
import FormBuilderPreviewButton from "./preview"

export function BuilderHeader() {
  const { formName } = useFormInfo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  const getFormData = () => {
    const { order, elements } = designerStore.state
    return order.map((id: string) => elements[id]).filter(Boolean)
  }

  const handleSave = () => {
    const data = getFormData()
    console.log("Save:", { formName, elements: data })
  }

  const handlePublish = () => {
    const data = getFormData()
    console.log("Publish:", { formName, elements: data, published: true })
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => designerStore.actions.undo()}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <ArrowCounterClockwiseIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => designerStore.actions.redo()}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <ArrowClockwiseIcon className="size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <FormBuilderPreviewButton />
        <Button variant="secondary" size="sm" onClick={handleSave}>
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button variant="default" size="sm" onClick={handlePublish}>
          <span className="hidden sm:inline">Publish</span>
        </Button>
      </div>
    </div>
  )
}
