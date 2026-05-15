import type { ReactNode, ElementType } from "react"

import type {
  TitleFieldAttributes,
  SubtitleFieldAttributes,
  ParagraphFieldAttributes,
  TextFieldAttributes,
  TextareaFieldAttributes,
  NumberFieldAttributes,
  DateFieldAttributes,
  CheckboxFieldAttributes,
  SelectFieldAttributes,
  SeparatorFieldAttributes,
  SpacerFieldAttributes,
} from "./form-schemas"

type ElementAttributesMap = {
  TitleField: TitleFieldAttributes
  SubtitleField: SubtitleFieldAttributes
  ParagraphField: ParagraphFieldAttributes
  TextField: TextFieldAttributes
  TextareaField: TextareaFieldAttributes
  NumberField: NumberFieldAttributes
  DateField: DateFieldAttributes
  CheckboxField: CheckboxFieldAttributes
  SelectField: SelectFieldAttributes
  SeparatorField: SeparatorFieldAttributes
  SpacerField: SpacerFieldAttributes
}

export type ElementsType = keyof ElementAttributesMap

export type FormElementInstance = {
  [K in ElementsType]: {
    id: string
    type: K
    extraAttributes: ElementAttributesMap[K]
  }
}[ElementsType]

export type FormContent = FormElementInstance[]

export type AttributesOf<T extends ElementsType> = ElementAttributesMap[T]
export type ElementInstanceOf<T extends ElementsType> = Extract<FormElementInstance, { type: T }>

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
    value?: string
    defaultValue?: string
    errorMessage?: string
    onBlur?: () => void
  }) => ReactNode
  propertiesComponent: (props: { elementInstance: FormElementInstance }) => ReactNode
  validate: (formElement: FormElementInstance, currentValue: string) => boolean
}
