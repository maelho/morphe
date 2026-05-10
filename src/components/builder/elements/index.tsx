import type { ElementsType, FormElement } from "../types/elements"
import { TitleFieldFormElement } from "./title-field"

export type FormElementsType = {
  [key in ElementsType]: FormElement
}

export const FormElements: FormElementsType = {
  TitleField: TitleFieldFormElement,
}
