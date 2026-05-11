import type { ReactNode, ElementType } from "react"

// type FieldAttributes = {
//   label: string
//   required: boolean
//   helperText: string
// }

// type WithPlaceholder = {
//   placeholder: string
// }

type TitleFieldAttributes = {
  title: string
}

// type TextFieldAttributes = FieldAttributes & WithPlaceholder
// type NumberFieldAttributes = FieldAttributes & WithPlaceholder

// type SelectFieldAttributes = FieldAttributes & {
//   options: string[]
// }

type ElementAttributesMap = {
  TitleField: TitleFieldAttributes
  // TextField: TextFieldAttributes
  // NumberField: NumberFieldAttributes
  // SelectField: SelectFieldAttributes
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
    defaultValue?: string
  }) => ReactNode
  propertiesComponent: (props: { elementInstance: FormElementInstance }) => ReactNode
  validate: (formElement: FormElementInstance, currentValue: string) => boolean
}
