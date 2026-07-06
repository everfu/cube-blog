"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

export const THEME_CHOICES = ['system', 'light', 'dark'] as const
export const RESOLVED_THEMES = ['light', 'dark'] as const

export type ThemeChoice = (typeof THEME_CHOICES)[number]
export type ResolvedTheme = (typeof RESOLVED_THEMES)[number]

type Attribute = `data-${string}` | 'class'
const DEFAULT_THEMES: ResolvedTheme[] = ['light', 'dark']

export interface ThemeProviderProps {
  children: ReactNode
  themes?: ResolvedTheme[]
  forcedTheme?: ThemeChoice
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  enableColorScheme?: boolean
  storageKey?: string
  defaultTheme?: ThemeChoice
  attribute?: Attribute | Attribute[]
  value?: Partial<Record<ResolvedTheme, string>>
}

interface ThemeContextValue {
  themes: ThemeChoice[]
  forcedTheme?: ThemeChoice
  setTheme: Dispatch<SetStateAction<ThemeChoice>>
  theme: ThemeChoice
  resolvedTheme: ResolvedTheme
  systemTheme?: ResolvedTheme
}

const ThemeContext = createContext<ThemeContextValue>({
  themes: [],
  setTheme: () => undefined,
  theme: 'system',
  resolvedTheme: 'light',
})

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return THEME_CHOICES.includes(value as ThemeChoice)
}

function isResolvedTheme(value: unknown): value is ResolvedTheme {
  return RESOLVED_THEMES.includes(value as ResolvedTheme)
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(storageKey: string, fallback: ThemeChoice): ThemeChoice {
  if (typeof window === 'undefined') return fallback
  try {
    const storedTheme = localStorage.getItem(storageKey)
    return isThemeChoice(storedTheme) ? storedTheme : fallback
  } catch {
    return fallback
  }
}

function resolveTheme(theme: ThemeChoice, systemTheme: ResolvedTheme, enableSystem: boolean): ResolvedTheme {
  if (theme === 'system') {
    return enableSystem ? systemTheme : 'light'
  }

  return theme
}

function disableTransitions() {
  const style = document.createElement('style')
  style.appendChild(document.createTextNode('*,*::before,*::after{transition:none!important}'))
  document.head.appendChild(style)
  return () => {
    window.getComputedStyle(document.body)
    setTimeout(() => document.head.removeChild(style), 1)
  }
}

export function applyThemeAttribute({
  attribute,
  enableColorScheme,
  resolvedTheme,
  themes,
  value,
}: {
  attribute: Attribute | Attribute[]
  enableColorScheme: boolean
  resolvedTheme: ResolvedTheme
  themes: ResolvedTheme[]
  value?: Partial<Record<ResolvedTheme, string>>
}) {
  const root = document.documentElement
  const mappedTheme = value?.[resolvedTheme] || resolvedTheme

  const applyAttribute = (attr: Attribute) => {
    if (attr === 'class') {
      const classNames = value ? themes.map(theme => value[theme] || theme) : themes
      root.classList.remove(...classNames)
      root.classList.add(mappedTheme)
      return
    }

    root.setAttribute(attr, mappedTheme)
  }

  const attributes = Array.isArray(attribute) ? attribute : [attribute]
  attributes.forEach(applyAttribute)

  if (enableColorScheme && isResolvedTheme(resolvedTheme)) {
    root.style.colorScheme = resolvedTheme
  }
}

export function ThemeProvider({
  children,
  themes = DEFAULT_THEMES,
  forcedTheme,
  enableSystem = true,
  disableTransitionOnChange = false,
  enableColorScheme = true,
  storageKey = 'theme',
  defaultTheme = enableSystem ? 'system' : 'light',
  attribute = 'data-theme',
  value,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState(() => getStoredTheme(storageKey, defaultTheme))
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme())

  const resolvedTheme = resolveTheme(forcedTheme || theme, systemTheme, enableSystem)

  const setTheme = useCallback<Dispatch<SetStateAction<ThemeChoice>>>((nextTheme) => {
    setThemeState((currentTheme) => {
      const value = typeof nextTheme === 'function' ? nextTheme(currentTheme) : nextTheme
      const validTheme = isThemeChoice(value) ? value : defaultTheme

      try {
        localStorage.setItem(storageKey, validTheme)
      } catch {
        // Ignore storage failures; the in-memory state still updates.
      }
      return validTheme
    })
  }, [defaultTheme, storageKey])

  useEffect(() => {
    if (!enableSystem) return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setSystemTheme(media.matches ? 'dark' : 'light')
    handleChange()
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [enableSystem])

  useEffect(() => {
    const restoreTransitions = disableTransitionOnChange ? disableTransitions() : undefined
    applyThemeAttribute({
      attribute,
      enableColorScheme,
      resolvedTheme,
      themes,
      value,
    })
    restoreTransitions?.()
  }, [attribute, disableTransitionOnChange, enableColorScheme, resolvedTheme, themes, value])

  const contextValue = useMemo<ThemeContextValue>(() => ({
    themes: enableSystem ? [...themes, 'system'] : themes,
    forcedTheme,
    setTheme,
    theme,
    resolvedTheme,
    systemTheme: enableSystem ? systemTheme : undefined,
  }), [enableSystem, forcedTheme, resolvedTheme, setTheme, systemTheme, theme, themes])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
