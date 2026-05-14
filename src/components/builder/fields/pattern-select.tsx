import { z } from "zod"

import { Field, FieldDescription, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "#/components/ui/select"

interface PatternSelectProps {
  value: string
  customValue: string
  onChange: (pattern: string, customPattern: string) => void
  label?: string
  description?: string
}

const PATTERNS = [
  { label: "None", value: "none", hint: "" },
  { label: "Email", value: "email", hint: "user@example.com" },
  { label: "URL", value: "url", hint: "https://…" },
  { label: "Phone", value: "phone", hint: "+1 (555) 000-0000" },
  { label: "Postal Code", value: "postal", hint: "90210" },
  { label: "Alphanumeric", value: "alphanumeric", hint: "abc123" },
  { label: "Digits Only", value: "digits", hint: "0–9" },
  { label: "Custom Regex…", value: "custom", hint: "" },
]

function isValidRegex(pattern: string): boolean {
  if (!pattern) return false
  try {
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
}

export function PatternSelect({
  value,
  customValue,
  onChange,
  label = "Pattern",
  description,
}: PatternSelectProps): React.ReactElement {
  const isCustom = value === "custom"
  const customValid = isValidRegex(customValue)

  const selectedItem = PATTERNS.find((p) => p.value === value) ?? PATTERNS[0]

  const handlePatternChange = (item: (typeof PATTERNS)[number] | null) => {
    const pattern = item?.value ?? "none"
    onChange(pattern, pattern === "custom" ? customValue : "")
  }

  const handleCustomPatternChange = (newCustomPattern: string) => {
    onChange("custom", newCustomPattern)
  }

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>

      <Select value={selectedItem} onValueChange={handlePatternChange} items={PATTERNS}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {PATTERNS.map((pattern) => (
            <SelectItem key={pattern.value} value={pattern}>
              <span>{pattern.label}</span>
              {pattern.hint && (
                <span className="ml-2 text-xs text-muted-foreground">{pattern.hint}</span>
              )}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isCustom && (
        <div className="relative">
          <Input
            placeholder="e.g. ^[A-Z]{2,4}$"
            value={customValue}
            onChange={(e) => handleCustomPatternChange(e.target.value)}
            className={
              customValue ? (customValid ? "border-green-500 pr-8" : "border-destructive pr-8") : ""
            }
          />
          {customValue && (
            <span
              className={`pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-sm font-medium ${
                customValid ? "text-green-500" : "text-destructive"
              }`}
            >
              {customValid ? "✓" : "✗"}
            </span>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {customValue && !customValid
              ? "Invalid regular expression"
              : "Enter a valid JavaScript regex"}
          </p>
        </div>
      )}
    </Field>
  )
}

export function getPatternValidator(
  pattern: string,
  customPattern?: string,
): z.ZodType<string> | null {
  const validators: Record<string, () => z.ZodType<string>> = {
    email: () => z.email(),
    url: () => z.url(),
    phone: () => z.string().regex(/^[0-9+\-\s()]{10,}$/),
    postal: () => z.string().regex(/^[A-Z0-9]{3,10}$/i),
    alphanumeric: () => z.string().regex(/^[a-zA-Z0-9]+$/),
    digits: () => z.string().regex(/^[0-9]+$/),
  }

  if (pattern === "custom" && customPattern) {
    try {
      return z.string().regex(new RegExp(customPattern))
    } catch {
      return z.string()
    }
  }

  return validators[pattern]?.() ?? null
}
