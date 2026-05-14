import { Button } from "#/components/ui/button"

import { designerStore, useFormInfo } from "./designer/store"

export function BuilderHeader() {
  const { formName } = useFormInfo()

  const getFormData = () => {
    const { order, elements } = designerStore.state
    return order.map((id: string) => elements[id]).filter(Boolean)
  }

  const handlePreview = () => {
    const data = getFormData()
    console.log("Preview:", data)
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
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handlePreview}>
        <span className="hidden sm:inline">Preview</span>
      </Button>
      <Button variant="secondary" size="sm" onClick={handleSave}>
        <span className="hidden sm:inline">Save</span>
      </Button>
      <Button variant="default" size="sm" onClick={handlePublish}>
        <span className="hidden sm:inline">Publish</span>
      </Button>
    </div>
  )
}
