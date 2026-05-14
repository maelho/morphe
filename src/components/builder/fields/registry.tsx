import type { ElementsType, FormElement } from "../form-types"
import { CheckboxFieldFormElement } from "./checkbox-field"
import { DateFieldFormElement } from "./date-field"
import { NumberFieldFormElement } from "./number-field"
import { ParagraphFieldFormElement } from "./paragraph-field"
import { SelectFieldFormElement } from "./select-field"
import { SeparatorFieldFormElement } from "./separator-field"
import { SpacerFieldFormElement } from "./spacer-field"
import { SubtitleFieldFormElement } from "./subtitle-field"
import { TextFieldFormElement } from "./text-field"
import { TextareaFieldFormElement } from "./textarea-field"
import { TitleFieldFormElement } from "./title-field"

export type FormElementsType = {
  [key in ElementsType]: FormElement
}

export const FormElements: FormElementsType = {
  TitleField: TitleFieldFormElement,
  SubtitleField: SubtitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  TextField: TextFieldFormElement,
  TextareaField: TextareaFieldFormElement,
  NumberField: NumberFieldFormElement,
  DateField: DateFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  SelectField: SelectFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
}

export const layoutElements: ElementsType[] = [
  "TitleField",
  "SubtitleField",
  "ParagraphField",
  "SeparatorField",
  "SpacerField",
]

export const inputElements: ElementsType[] = [
  "TextField",
  "TextareaField",
  "NumberField",
  "DateField",
  "CheckboxField",
  "SelectField",
]
