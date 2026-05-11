import type { ElementsType, FormElement } from "../form-types"
import { TitleFieldFormElement } from "./title-field"

export type FormElementsType = {
  [key in ElementsType]: FormElement
}

export const FormElements: FormElementsType = {
  TitleField: TitleFieldFormElement,
}
