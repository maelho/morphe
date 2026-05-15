import { Debouncer } from "@tanstack/pacer"
import { useEffect, useRef } from "react"

import type { designerStore } from "./store"
import type { DesignerStore } from "./store"

const STORAGE_PREFIX = "designer-store-"
const STORAGE_VERSION = 1

type PersistedPayload = {
  version: number
  elements: DesignerStore["elements"]
  order: DesignerStore["order"]
  formId: DesignerStore["formId"]
  formName: DesignerStore["formName"]
}

export function getStorageKey(formId: string | null): string {
  return formId ? `${STORAGE_PREFIX}${formId}` : `${STORAGE_PREFIX}default`
}

export function saveToStorage(state: DesignerStore): void {
  try {
    const payload: PersistedPayload = {
      version: STORAGE_VERSION,
      elements: state.elements,
      order: state.order,
      formId: state.formId,
      formName: state.formName,
    }
    localStorage.setItem(getStorageKey(state.formId), JSON.stringify(payload))
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[designerStore] failed to save to localStorage:", e)
    }
  }
}

export function loadFromStorage(formId: string | null): Partial<DesignerStore> | null {
  try {
    const raw = localStorage.getItem(getStorageKey(formId))
    if (!raw) return null

    const data = JSON.parse(raw) as Partial<PersistedPayload>

    // Discard stale data produced by a different schema version.
    if (data.version !== STORAGE_VERSION) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[designerStore] storage version mismatch (stored ${data.version}, expected ${STORAGE_VERSION}). Discarding.`,
        )
      }
      localStorage.removeItem(getStorageKey(formId))
      return null
    }

    return {
      elements: data.elements ?? {},
      order: data.order ?? [],
      formId: data.formId ?? formId,
      formName: data.formName ?? null,
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[designerStore] failed to load from localStorage:", e)
    }
    return null
  }
}

export function clearDesignerStorage(formId: string | null): void {
  try {
    localStorage.removeItem(getStorageKey(formId))
  } catch {
    // ignore
  }
}

export function hydrateDesignerStore(
  store: Pick<typeof designerStore, "setState">,
  formId: string | null,
): void {
  const data = loadFromStorage(formId)
  if (!data) return

  store.setState((state) => ({
    ...state,
    elements: data.elements ?? {},
    order: data.order ?? [],
    formId: data.formId ?? formId,
    formName: data.formName ?? null,
    // Reset runtime-only fields — these should never be restored from disk.
    selectedElementId: null,
    editingElementId: null,
    past: [],
    future: [],
  }))
}

export function useDesignerPersistence(
  store: Pick<typeof designerStore, "subscribe" | "state">,
): void {
  const debouncerRef = useRef(
    new Debouncer((state: DesignerStore) => saveToStorage(state), { wait: 300 }),
  )

  const lastFingerprintRef = useRef<string | null>(null)
  const latestStateRef = useRef<DesignerStore>(store.state)

  useEffect(() => {
    const debouncer = debouncerRef.current

    const subscription = store.subscribe((state: DesignerStore) => {
      latestStateRef.current = state

      const fingerprint = JSON.stringify({
        elements: state.elements,
        order: state.order,
        formId: state.formId,
        formName: state.formName,
      })

      if (fingerprint === lastFingerprintRef.current) return

      lastFingerprintRef.current = fingerprint
      debouncer.maybeExecute(state)
    })

    return () => {
      // Cancel the pending debounced write, then save immediately.
      debouncer.cancel()
      saveToStorage(latestStateRef.current)
      subscription.unsubscribe()
    }
  }, [store])
}
