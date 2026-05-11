import { PlusIcon, TrashIcon } from "@phosphor-icons/react"
import type React from "react"
import { useId } from "react"

import { Button } from "#/components/ui/button"
import { Field, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"

type Option = {
  id: string
  value: string
  label: string
}

type OptionsEditorProps = {
  value: Option[]
  onChange: (options: Option[]) => void
  label?: string
}

export function OptionsEditor({
  value,
  onChange,
  label = "Options",
}: OptionsEditorProps): React.ReactElement {
  const uid = useId()

  const addOption = () => {
    const n = value.length + 1
    onChange([...value, { id: `${uid}-option-${n}`, value: `option${n}`, label: `Option ${n}` }])
  }

  const removeOption = (id: string) => {
    onChange(value.filter((opt) => opt.id !== id))
  }

  const updateOption = (id: string, prop: "label" | "value", newValue: string) => {
    onChange(value.map((opt) => (opt.id === id ? { ...opt, [prop]: newValue } : opt)))
  }

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-2">
        {value.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <Input
              placeholder="Label"
              value={option.label}
              onChange={(e) => updateOption(option.id, "label", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={option.value}
              onChange={(e) => updateOption(option.id, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeOption(option.id)}
              disabled={value.length <= 1}
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addOption} className="w-full">
          <PlusIcon className="mr-1 size-4" />
          Add Option
        </Button>
      </div>
    </Field>
  )
}
