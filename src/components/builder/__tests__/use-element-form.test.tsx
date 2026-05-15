import { renderHook, act } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { z } from "zod"

import { designerStore } from "../designer/store"
import { useElementForm } from "../fields/use-element-form"
import type { ElementInstanceOf } from "../form-types"

const testSchema = z.object({
  label: z.string(),
  required: z.boolean(),
  helperText: z.string(),
  customErrorMessage: z.string(),
  disabled: z.boolean(),
  placeholder: z.string(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
})

function createElement(overrides?: Record<string, unknown>): ElementInstanceOf<"TextField"> {
  const attrs = {
    label: "Name",
    required: false,
    helperText: "",
    customErrorMessage: "",
    disabled: false,
    placeholder: "",
    ...overrides,
  }
  return {
    id: "test-id",
    type: "TextField",
    extraAttributes: attrs,
  } as unknown as ElementInstanceOf<"TextField">
}

function getFormValues(result: { current: ReturnType<typeof useElementForm> }) {
  return result.current.state.values as Record<string, unknown>
}

beforeEach(() => {
  designerStore.setState(() => ({
    elements: {},
    order: [],
    selectedElementId: null,
    editingElementId: null,
    formId: null,
    formName: null,
    past: [],
    future: [],
  }))
})

describe("useElementForm", () => {
  describe("initialization", () => {
    it("creates a form with element's extraAttributes as defaultValues", () => {
      const element = createElement({ label: "Email", placeholder: "Enter email" })
      const { result } = renderHook(() => useElementForm(element, testSchema))

      expect(result.current.state.values).toEqual({
        label: "Email",
        required: false,
        helperText: "",
        customErrorMessage: "",
        disabled: false,
        placeholder: "Enter email",
      })
    })

    it("initializes with default schema validation", () => {
      const element = createElement({ label: "Test" })
      const { result } = renderHook(() => useElementForm(element, testSchema))

      expect(result.current.state.values).toBeDefined()
      expect(result.current.state.isValid).toBe(true)
    })
  })

  describe("reset behavior", () => {
    it("resets form when element reference changes", () => {
      const element1 = createElement({ label: "First" })
      const { result, rerender } = renderHook(
        ({ element }) => useElementForm(element, testSchema),
        { initialProps: { element: element1 } },
      )

      expect(getFormValues(result).label).toBe("First")

      const element2 = createElement({ label: "Second" })
      rerender({ element: element2 })

      expect(getFormValues(result).label).toBe("Second")
    })

    it("resets to new values while preserving form instance", () => {
      const element1 = createElement({ label: "Label 1", required: true })
      const { result, rerender } = renderHook(
        ({ element }) => useElementForm(element, testSchema),
        { initialProps: { element: element1 } },
      )

      act(() => {
        result.current.setFieldValue("label", "Modified")
      })

      expect(getFormValues(result).label).toBe("Modified")

      const element2 = createElement({ label: "Label 2" })
      rerender({ element: element2 })

      expect(getFormValues(result).label).toBe("Label 2")
    })
  })

  describe("field operations", () => {
    it("updates field value with setFieldValue", () => {
      const element = createElement()
      const { result } = renderHook(() => useElementForm(element, testSchema))

      act(() => {
        result.current.setFieldValue("label", "New Label")
      })

      expect(getFormValues(result).label).toBe("New Label")
    })

    it("updates multiple fields", () => {
      const element = createElement()
      const { result } = renderHook(() => useElementForm(element, testSchema))

      act(() => {
        result.current.setFieldValue("label", "Updated")
        result.current.setFieldValue("required", true)
        result.current.setFieldValue("helperText", "Help info")
      })

      const values = getFormValues(result)
      expect(values.label).toBe("Updated")
      expect(values.required).toBe(true)
      expect(values.helperText).toBe("Help info")
    })

    it("updates field value via state", () => {
      const element = createElement({ label: "Initial" })
      const { result } = renderHook(() => useElementForm(element, testSchema))

      act(() => {
        result.current.setFieldValue("label", "Updated")
      })

      const values = result.current.state.values as Record<string, unknown>
      expect(values.label).toBe("Updated")
    })

    it("tracks multiple field values via state", () => {
      const element = createElement({ label: "Test" })
      const { result } = renderHook(() => useElementForm(element, testSchema))

      act(() => {
        result.current.setFieldValue("label", "Label")
        result.current.setFieldValue("required", true)
      })

      const values = result.current.state.values as Record<string, unknown>
      expect(values.label).toBe("Label")
      expect(values.required).toBe(true)
    })
  })

  describe("submit behavior", () => {
    it("handleSubmit can be called without error", () => {
      const element = createElement()
      const { result } = renderHook(() => useElementForm(element, testSchema))

      act(() => {
        result.current.setFieldValue("label", "Test")
      })

      act(() => {
        result.current.handleSubmit()
      })

      const values = result.current.state.values as Record<string, unknown>
      expect(values.label).toBe("Test")
    })
  })

  describe("form state", () => {
    it("tracks dirty state after modifications", () => {
      const element = createElement()
      const { result } = renderHook(() => useElementForm(element, testSchema))

      expect(result.current.state.isDirty).toBe(false)

      act(() => {
        result.current.setFieldValue("label", "Changed")
      })

      expect(result.current.state.isDirty).toBe(true)
    })

    it("resets dirty state after reset", () => {
      const element = createElement()
      const { result, rerender } = renderHook(
        ({ element }) => useElementForm(element, testSchema),
        { initialProps: { element } },
      )

      act(() => {
        result.current.setFieldValue("label", "Changed")
      })
      expect(result.current.state.isDirty).toBe(true)

      const newElement = createElement({ label: "New" })
      rerender({ element: newElement })

      expect(result.current.state.isDirty).toBe(false)
    })
  })

  describe("edge cases", () => {
    it("handles optional numeric fields", () => {
      const element = createElement({ minLength: 5, maxLength: 100 })
      const { result } = renderHook(() => useElementForm(element, testSchema))

      expect(getFormValues(result).minLength).toBe(5)
      expect(getFormValues(result).maxLength).toBe(100)
    })

    it("handles undefined optional fields", () => {
      const element = createElement()
      const { result } = renderHook(() => useElementForm(element, testSchema))

      expect(getFormValues(result).minLength).toBeUndefined()
      expect(getFormValues(result).maxLength).toBeUndefined()
    })

    it("handles boolean fields correctly", () => {
      const element = createElement({ required: true, disabled: false })
      const { result } = renderHook(() => useElementForm(element, testSchema))

      expect(getFormValues(result).required).toBe(true)
      expect(getFormValues(result).disabled).toBe(false)
    })
  })
})
