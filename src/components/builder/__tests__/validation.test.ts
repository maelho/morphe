import { describe, expect, it } from "vitest"

import { buildFormSchema } from "../fields/validation"
import type { FormContent, FormElementInstance } from "../form-types"

function getFormSchema(content: FormContent) {
  const elementOrder = content.map((e) => e.id)

  const elements = content.reduce(
    (acc, e) => {
      acc[e.id] = e as FormElementInstance
      return acc
    },
    {} as Record<string, FormElementInstance>,
  )

  return buildFormSchema(elementOrder, elements)
}

describe("buildFormSchema", () => {
  it("validates TextField", () => {
    const schema = getFormSchema([
      {
        id: "name",
        type: "TextField",
        extraAttributes: {
          label: "Name",
          placeholder: "John",
          helperText: "",
          required: true,
          minLength: 2,
          maxLength: 10,
          pattern: undefined,
          customPattern: undefined,
          customErrorMessage: "",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        name: "John",
      }).success,
    ).toBe(true)

    expect(
      schema.safeParse({
        name: "",
      }).success,
    ).toBe(false)

    expect(
      schema.safeParse({
        name: "A",
      }).success,
    ).toBe(false)
  })

  it("allows optional empty TextField", () => {
    const schema = getFormSchema([
      {
        id: "promo",
        type: "TextField",
        extraAttributes: {
          label: "Promo",
          placeholder: "",
          helperText: "",
          required: false,
          minLength: 5,
          maxLength: undefined,
          pattern: undefined,
          customPattern: undefined,
          customErrorMessage: "",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        promo: "",
      }).success,
    ).toBe(true)
  })

  it("validates TextField patterns", () => {
    const schema = getFormSchema([
      {
        id: "email",
        type: "TextField",
        extraAttributes: {
          label: "Email",
          placeholder: "john@example.com",
          helperText: "",
          required: true,
          minLength: undefined,
          maxLength: undefined,
          pattern: "email",
          customPattern: undefined,
          customErrorMessage: "Invalid email",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        email: "john@example.com",
      }).success,
    ).toBe(true)

    expect(
      schema.safeParse({
        email: "invalid",
      }).success,
    ).toBe(false)
  })

  it("validates custom TextField patterns", () => {
    const schema = getFormSchema([
      {
        id: "promo",
        type: "TextField",
        extraAttributes: {
          label: "Promo",
          placeholder: "SAVE",
          helperText: "",
          required: false,
          minLength: undefined,
          maxLength: undefined,
          pattern: "custom",
          customPattern: "^[A-Z]{2,4}$",
          customErrorMessage: "Invalid code",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        promo: "SAVE",
      }).success,
    ).toBe(true)

    expect(
      schema.safeParse({
        promo: "save",
      }).success,
    ).toBe(false)
  })

  it("validates TextareaField", () => {
    const schema = getFormSchema([
      {
        id: "message",
        type: "TextareaField",
        extraAttributes: {
          label: "Message",
          placeholder: "Write something",
          helperText: "",
          required: true,
          minLength: 10,
          maxLength: 100,
          rows: 4,
          customErrorMessage: "",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        message: "This is a valid message",
      }).success,
    ).toBe(true)

    expect(
      schema.safeParse({
        message: "short",
      }).success,
    ).toBe(false)
  })

  it("validates NumberField", () => {
    const schema = getFormSchema([
      {
        id: "age",
        type: "NumberField",
        extraAttributes: {
          label: "Age",
          placeholder: "18",
          helperText: "",
          required: true,
          min: 18,
          max: 100,
          step: 1,
          customErrorMessage: "",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        age: "25",
      }).success,
    ).toBe(true)

    expect(
      schema.safeParse({
        age: "17",
      }).success,
    ).toBe(false)

    expect(
      schema.safeParse({
        age: "101",
      }).success,
    ).toBe(false)

    expect(
      schema.safeParse({
        age: "abc",
      }).success,
    ).toBe(false)
  })

  it("validates DateField", () => {
    const schema = getFormSchema([
      {
        id: "visitDate",
        type: "DateField",
        extraAttributes: {
          label: "Visit Date",
          helperText: "",
          required: true,
          minDate: "2024-01-01",
          maxDate: "2024-12-31",
          customErrorMessage: "",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        visitDate: "2024-06-01",
      }).success,
    ).toBe(true)

    expect(
      schema.safeParse({
        visitDate: "2023-12-31",
      }).success,
    ).toBe(false)

    expect(
      schema.safeParse({
        visitDate: "2025-01-01",
      }).success,
    ).toBe(false)
  })

  it("validates CheckboxField", () => {
    const schema = getFormSchema([
      {
        id: "terms",
        type: "CheckboxField",
        extraAttributes: {
          label: "Accept terms",
          helperText: "",
          required: true,
          customErrorMessage: "",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        terms: true,
      }).success,
    ).toBe(true)

    expect(
      schema.safeParse({
        terms: false,
      }).success,
    ).toBe(false)
  })

  it("validates SelectField", () => {
    const schema = getFormSchema([
      {
        id: "country",
        type: "SelectField",
        extraAttributes: {
          label: "Country",
          placeholder: "Select country",
          helperText: "",
          required: true,
          options: [
            {
              value: "us",
              label: "United States",
            },
            {
              value: "ca",
              label: "Canada",
            },
          ],
          allowClear: false,
          searchable: false,
          customErrorMessage: "",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        country: "us",
      }).success,
    ).toBe(true)

    expect(
      schema.safeParse({
        country: "",
      }).success,
    ).toBe(false)
  })

  it("ignores TitleField", () => {
    const schema = getFormSchema([
      {
        id: "title",
        type: "TitleField",
        extraAttributes: {
          title: "Form Title",
          fontSize: "lg",
          fontWeight: "bold",
          alignment: "left",
        },
      },
    ])

    expect(schema.safeParse({}).success).toBe(true)
  })

  it("ignores SubtitleField", () => {
    const schema = getFormSchema([
      {
        id: "subtitle",
        type: "SubtitleField",
        extraAttributes: {
          subtitle: "Subtitle",
          fontSize: "md",
          fontWeight: "medium",
          alignment: "left",
        },
      },
    ])

    expect(schema.safeParse({}).success).toBe(true)
  })

  it("ignores ParagraphField", () => {
    const schema = getFormSchema([
      {
        id: "paragraph",
        type: "ParagraphField",
        extraAttributes: {
          text: "Paragraph text",
          fontSize: "md",
          alignment: "left",
        },
      },
    ])

    expect(schema.safeParse({}).success).toBe(true)
  })

  it("ignores SeparatorField", () => {
    const schema = getFormSchema([
      {
        id: "separator",
        type: "SeparatorField",
        extraAttributes: {
          thickness: 1,
          style: "solid",
          color: undefined,
        },
      },
    ])

    expect(schema.safeParse({}).success).toBe(true)
  })

  it("ignores SpacerField", () => {
    const schema = getFormSchema([
      {
        id: "spacer",
        type: "SpacerField",
        extraAttributes: {
          height: 24,
        },
      },
    ])

    expect(schema.safeParse({}).success).toBe(true)
  })

  it("supports mixed forms", () => {
    const schema = getFormSchema([
      {
        id: "title",
        type: "TitleField",
        extraAttributes: {
          title: "Registration",
          fontSize: "lg",
          fontWeight: "bold",
          alignment: "left",
        },
      },
      {
        id: "name",
        type: "TextField",
        extraAttributes: {
          label: "Name",
          placeholder: "John",
          helperText: "",
          required: true,
          minLength: 2,
          maxLength: 50,
          pattern: undefined,
          customPattern: undefined,
          customErrorMessage: "",
          disabled: false,
        },
      },
      {
        id: "age",
        type: "NumberField",
        extraAttributes: {
          label: "Age",
          placeholder: "18",
          helperText: "",
          required: true,
          min: 18,
          max: 100,
          step: 1,
          customErrorMessage: "",
          disabled: false,
        },
      },
      {
        id: "terms",
        type: "CheckboxField",
        extraAttributes: {
          label: "Accept terms",
          helperText: "",
          required: true,
          customErrorMessage: "",
          disabled: false,
        },
      },
    ])

    expect(
      schema.safeParse({
        name: "John",
        age: "25",
        terms: true,
      }).success,
    ).toBe(true)
  })
})
