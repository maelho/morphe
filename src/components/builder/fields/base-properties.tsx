import type { ReactNode } from "react"

import { Separator } from "#/components/ui/separator"

import { CollapsibleSection } from "./collapsible-section"
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

  return (
    <div className="space-y-2">
      <CollapsibleSection title="Basic Settings">
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
      </CollapsibleSection>

      {showValidation && (
        <>
          <Separator />
          <CollapsibleSection title="Validation" defaultOpen={false}>
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
          </CollapsibleSection>
        </>
      )}

      {children}

      {hasAdvanced && (
        <>
          <Separator />
          <CollapsibleSection title="Advanced" defaultOpen={false}>
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
          </CollapsibleSection>
        </>
      )}
    </div>
  )
}
