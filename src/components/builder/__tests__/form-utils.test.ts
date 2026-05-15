import type { FormContent } from "../form-types"
import { parseFormContent, serializeFormContent } from "../form-utils"

const validFormContent: FormContent = [
  {
    id: "1",
    type: "TitleField",
    extraAttributes: { title: "My Form", fontSize: "md", fontWeight: "bold", alignment: "left" },
  },
  {
    id: "2",
    type: "TextField",
    extraAttributes: {
      label: "Name",
      required: true,
      helperText: "",
      customErrorMessage: "",
      disabled: false,
      placeholder: "Enter your name",
      minLength: undefined,
      maxLength: undefined,
      pattern: undefined,
      customPattern: undefined,
    },
  },
]

describe("serializeFormContent", () => {
  it("serializes valid form content to JSON string", () => {
    const json = serializeFormContent(validFormContent)
    const parsed = JSON.parse(json)
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed).toHaveLength(2)
    expect(parsed[0].type).toBe("TitleField")
    expect(parsed[1].type).toBe("TextField")
  })

  it("round-trips through parseFormContent", () => {
    const json = serializeFormContent(validFormContent)
    const parsed = parseFormContent(json)
    expect(parsed).toEqual(validFormContent)
  })

  it("serializes empty array", () => {
    const json = serializeFormContent([])
    expect(json).toBe("[]")
  })
})

describe("parseFormContent", () => {
  it("parses valid JSON string into FormContent", () => {
    const json = JSON.stringify(validFormContent)
    const result = parseFormContent(json)
    expect(result).toHaveLength(2)
    expect(result[0].type).toBe("TitleField")
    expect(result[1].type).toBe("TextField")
  })

  it("parses empty array", () => {
    const result = parseFormContent("[]")
    expect(result).toEqual([])
  })

  it("throws on malformed JSON", () => {
    expect(() => parseFormContent("not json")).toThrow("Form content is not valid JSON")
  })

  it("throws on invalid element type", () => {
    const invalid = [{ id: "1", type: "UnknownField", extraAttributes: {} }]
    expect(() => parseFormContent(JSON.stringify(invalid))).toThrow(
      "Form content failed validation",
    )
  })

  it("throws on element missing required fields", () => {
    const invalid = [{ id: "1", type: "TextField" }]
    expect(() => parseFormContent(JSON.stringify(invalid))).toThrow(
      "Form content failed validation",
    )
  })

  it("throws on non-array JSON", () => {
    expect(() => parseFormContent(JSON.stringify({ not: "array" }))).toThrow(
      "Form content failed validation",
    )
  })
})
