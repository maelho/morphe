import { ScriptOnce } from "@tanstack/react-router"
import { createContext, use, useCallback, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

function resolveTheme(theme: Theme): "dark" | "light" {
  if (theme !== "system") return theme
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme)
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

function readStorage(key: string, fallback: Theme): Theme {
  try {
    const stored = localStorage.getItem(key)
    if (stored === "light" || stored === "dark" || stored === "system") return stored
  } catch {}
  return fallback
}

function getThemeScript(storageKey: string, defaultTheme: Theme): string {
  const key = JSON.stringify(storageKey)
  const fallback = JSON.stringify(defaultTheme)
  return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function useTheme(): ThemeContextType {
  const ctx = use(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>")
  return ctx
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readStorage(storageKey, defaultTheme))

  // Apply theme + watch system changes when theme === "system"
  useEffect(() => {
    applyTheme(theme)
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyTheme("system")
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme])

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(storageKey, next)
      } catch {}
      setThemeState(next)
    },
    [storageKey],
  )

  return (
    <ThemeContext value={{ theme, setTheme }}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      {children}
    </ThemeContext>
  )
}
