export type ElementsType =
  | "TextField"
  | "TitleField"
  | "CheckboxField"
  | "DateField"
  | "NumberField"
  | "ParagraphField"
  | "SelectField"
  | "SeparatorField"
  | "SpacerField"
  | "SubTitleField"
  | "TextAreaField"

export type FormElementInstance = {
  id: string
  type: ElementsType
  extraAttributes?: Record<string, any>
}
