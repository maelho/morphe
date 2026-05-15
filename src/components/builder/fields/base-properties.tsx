import type { ReactNode } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs"

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
  const hasOptions = !!children

  return (
    <Tabs defaultValue="content">
      <TabsList className="flex w-full overflow-hidden">
        <TabsTrigger value="content" className="min-w-0 flex-1 basis-0 truncate px-1 text-xs">
          Content
        </TabsTrigger>
        {showValidation && (
          <TabsTrigger value="validation" className="min-w-0 flex-1 basis-0 truncate px-1 text-xs">
            Validation
          </TabsTrigger>
        )}
        {hasAdvanced && (
          <TabsTrigger value="advanced" className="min-w-0 flex-1 basis-0 truncate px-1 text-xs">
            Advanced
          </TabsTrigger>
        )}
        {hasOptions && (
          <TabsTrigger value="options" className="min-w-0 flex-1 basis-0 truncate px-1 text-xs">
            Options
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="content" className="pt-4">
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
      </TabsContent>

      {showValidation && (
        <TabsContent value="validation" className="pt-4">
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
        </TabsContent>
      )}

      {hasAdvanced && (
        <TabsContent value="advanced" className="pt-4">
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
        </TabsContent>
      )}

      {hasOptions && (
        <TabsContent value="options" className="pt-4">
          <div className="space-y-4">{children}</div>
        </TabsContent>
      )}
    </Tabs>
  )
}
