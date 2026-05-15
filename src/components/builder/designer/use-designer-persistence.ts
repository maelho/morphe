import { Debouncer } from "@tanstack/pacer"
import { useEffect, useRef } from "react"

import type { designerStore } from "./store"
import type { DesignerStore } from "./store"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = "designer-store-"

/**
 * Bump this whenever the persisted shape changes in a breaking way.
 * On a version mismatch the stored data is discarded rather than
 * trying to migrate, keeping the code simple and safe.
 */
const STORAGE_VERSION = 1

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

/** Only the fields we actually persist. Runtime-only state is excluded. */
type PersistedPayload = {
  version: number
  elements: DesignerStore["elements"]
  order: DesignerStore["order"]
  formId: DesignerStore["formId"]
  formName: DesignerStore["formName"]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getStorageKey(formId: string | null): string {
  return formId ? `${STORAGE_PREFIX}${formId}` : `${STORAGE_PREFIX}default`
}

// ---------------------------------------------------------------------------
// Core persistence API
// ---------------------------------------------------------------------------

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
    // Silently ignore — storage may be unavailable (e.g. private browsing).
  }
}

/**
 * Hydrates the store from localStorage for the given `formId`.
 * Resets all runtime-only state (selection, undo/redo history) so the
 * user always starts a session with a clean slate.
 */
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

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------

/**
 * Subscribes to the designer store and debounce-saves to localStorage
 * whenever structurally relevant state changes.
 *
 * Runtime-only fields (selectedElementId, editingElementId, past, future)
 * are intentionally excluded from the comparison so that hover/selection
 * interactions don't trigger unnecessary writes.
 */
export function useDesignerPersistence(
  store: Pick<typeof designerStore, "subscribe" | "state">,
): void {
  // Debouncer class instance — unlike the `debounce()` helper function,
  // `Debouncer` exposes `.cancel()` for cleanup on unmount.
  const debouncerRef = useRef(
    new Debouncer((state: DesignerStore) => saveToStorage(state), { wait: 300 }),
  )

  // Track the last-saved "structural fingerprint" so we skip writes when only
  // runtime state (selection, undo history) changed.
  const lastFingerprintRef = useRef<string | null>(null)

  // Keep a ref to the latest state so the cleanup can flush it without
  // needing store.state (which may not exist on the Pick type at runtime).
  const latestStateRef = useRef<DesignerStore>(store.state)

  useEffect(() => {
    const debouncer = debouncerRef.current

    // Store.subscribe(listener) returns a Subscription object: { unsubscribe() }.
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
      // Cancel the pending debounced write, then save immediately so the
      // last change is never silently dropped on unmount.
      debouncer.cancel()
      saveToStorage(latestStateRef.current)
      subscription.unsubscribe()
    }
  }, [store])
}
