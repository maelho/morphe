import type { ReactNode, ElementType } from "react"

export type ElementsType = "TitleField"
// | "TextField"
// | "CheckboxField"
// | "DateField"
// | "NumberField"
// | "ParagraphField"
// | "SelectField"
// | "SeparatorField"
// | "SpacerField"
// | "SubTitleField"
// | "TextAreaField"

export type FormElementInstance = {
  id: string
  type: ElementsType
  extraAttributes?: Record<string, unknown>
}

export type SubmitFunction = (key: string, value: string) => void

export type FormElement = {
  type: ElementsType

  construct: (id: string) => FormElementInstance

  designerButtonElement: {
    icon: ElementType
    label: string
  }

  designerComponent: (props: { elementInstance: FormElementInstance }) => ReactNode

  formComponent: (props: {
    elementInstance: FormElementInstance
    submitValue?: SubmitFunction
    isInvalid?: boolean
    defaultValue?: string
  }) => ReactNode

  propertiesComponent: (props: { elementInstance: FormElementInstance }) => ReactNode

  validate: (formElement: FormElementInstance, currentValue: string) => boolean
}
