import type { ReactNode } from "react"
import { useState } from "react"

import { cn } from "#/lib/utils"

import { StringProperty, SwitchProperty } from "./property-fields"

type BasePropertiesProps = {
  form: any
  children?: ReactNode
  hasPlaceholder?: boolean
  hasValidation?: boolean
  hasAdvanced?: boolean
  extraBasicSettings?: ReactNode
  extraValidationSettings?: ReactNode
}

type TabValue = "content" | "validation" | "advanced" | "options"

export function SegmentedControl<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex w-full rounded-md bg-muted/50 p-0.5 text-xs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex-1 rounded-sm px-2 py-1.5 font-medium transition-colors",
            value === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function BaseProperties({
  form,
  children,
  hasPlaceholder = true,
  hasValidation = true,
  hasAdvanced = true,
  extraBasicSettings,
  extraValidationSettings,
}: BasePropertiesProps) {
  const showValidation = hasValidation || !!extraValidationSettings
  const hasOptions = !!children

  const tabs = [
    { value: "content" as TabValue, label: "Content" },
    ...(showValidation ? [{ value: "validation" as TabValue, label: "Validation" }] : []),
    ...(hasAdvanced ? [{ value: "advanced" as TabValue, label: "Advanced" }] : []),
    ...(hasOptions ? [{ value: "options" as TabValue, label: "Options" }] : []),
  ]

  const [activeTab, setActiveTab] = useState<TabValue>("content")

  const renderContent = () => {
    switch (activeTab) {
      case "content":
        return (
          <div className="space-y-4">
            <form.Field name="label">
              {(field: any) => <StringProperty field={field} form={form} label="Label" />}
            </form.Field>
            {hasPlaceholder && (
              <form.Field name="placeholder">
                {(field: any) => <StringProperty field={field} form={form} label="Placeholder" />}
              </form.Field>
            )}
            <form.Field name="helperText">
              {(field: any) => (
                <StringProperty
                  field={field}
                  form={form}
                  label="Helper Text"
                  description="Appears below the field"
                />
              )}
            </form.Field>
            {extraBasicSettings}
          </div>
        )

      case "validation":
        return (
          <div className="space-y-4">
            {hasValidation && (
              <form.Field name="required">
                {(field: any) => <SwitchProperty field={field} form={form} label="Required" />}
              </form.Field>
            )}
            {extraValidationSettings}
            {hasValidation && (
              <form.Field name="customErrorMessage">
                {(field: any) => (
                  <StringProperty
                    field={field}
                    form={form}
                    label="Custom Error Message"
                    placeholder="e.g., This field is required"
                    description="Shows when validation fails"
                  />
                )}
              </form.Field>
            )}
          </div>
        )

      case "advanced":
        return (
          <div className="space-y-4">
            <form.Field name="disabled">
              {(field: any) => (
                <SwitchProperty
                  field={field}
                  form={form}
                  label="Disabled"
                  description="Prevent user interaction"
                />
              )}
            </form.Field>
          </div>
        )

      case "options":
        return <div className="space-y-4">{children}</div>

      default:
        return null
    }
  }

  return (
    <div className="flex min-h-0 flex-col">
      <SegmentedControl tabs={tabs} value={activeTab} onChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto pt-4">{renderContent()}</div>
    </div>
  )
}
