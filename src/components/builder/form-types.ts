import type { ReactNode, ElementType } from "react"

import type { NamedPattern } from "./form-schemas"

type TitleFieldAttributes = {
  title: string
  fontSize: "sm" | "md" | "lg" | "xl"
  fontWeight: "normal" | "medium" | "bold"
  alignment: "left" | "center" | "right"
  color?: string
}

type SubtitleFieldAttributes = {
  subtitle: string
  fontSize: "sm" | "md" | "lg"
  fontWeight: "normal" | "medium"
  alignment: "left" | "center" | "right"
  color?: string
}

type ParagraphFieldAttributes = {
  text: string
  fontSize: "sm" | "md" | "lg"
  alignment: "left" | "center" | "right"
  color?: string
}

type BaseFieldAttributes = {
  label: string
  required: boolean
  helperText: string
  customErrorMessage: string
  disabled: boolean
}

type PlaceholderAttributes = {
  placeholder: string
}

type ValidationAttributes = {
  minLength?: number
  maxLength?: number
  pattern?: NamedPattern
  customPattern?: string
}

type TextFieldAttributes = BaseFieldAttributes & PlaceholderAttributes & ValidationAttributes

type TextareaValidationAttributes = {
  minLength?: number
  maxLength?: number
  rows?: number
}

type TextareaFieldAttributes = BaseFieldAttributes &
  PlaceholderAttributes &
  TextareaValidationAttributes

type NumberValidationAttributes = {
  min?: number
  max?: number
  step?: number
}

type NumberFieldAttributes = BaseFieldAttributes &
  PlaceholderAttributes &
  NumberValidationAttributes

type DateValidationAttributes = {
  minDate?: string
  maxDate?: string
}

type DateFieldAttributes = BaseFieldAttributes & DateValidationAttributes

type CheckboxFieldAttributes = BaseFieldAttributes

type SelectOptionAttributes = {
  value: string
  label: string
}

type SelectValidationAttributes = {
  options: SelectOptionAttributes[]
  allowClear: boolean
  searchable: boolean
}

type SelectFieldAttributes = BaseFieldAttributes &
  PlaceholderAttributes &
  SelectValidationAttributes

type SeparatorFieldAttributes = {
  thickness: number
  style: "solid" | "dashed" | "dotted"
  color?: string
}

type SpacerFieldAttributes = {
  height: number
}

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
