"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import {
  createColorTokens,
  updateColorTokens,
  type ColorTokens,
  type ColorScheme,
  type Mode,
} from "@/lib/theme/color-tokens"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeContextType = {
  colorScheme: ColorScheme
  mode: Mode
  setColorScheme: (colorScheme: ColorScheme) => void
  setMode: (mode: Mode) => void
  colorTokens: ColorTokens
  // Para compatibilidad con código anterior
  theme: string
  setTheme: (theme: string) => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Estados separados para esquema de color y modo
  const [colorScheme, setColorScheme] = useState<ColorScheme>("blue")
  const [mode, setMode] = useState<Mode>("light")

  // Crear los tokens iniciales
  const [colorTokensState, setColorTokensState] = useState<ColorTokens>(() => {
    const tokens = createColorTokens("blue", "light")
    // Actualizar también la variable global
    updateColorTokens(tokens)
    return tokens
  })

  // Para compatibilidad con código anterior
  const theme = mode === "dark" ? "dark" : colorScheme === "blue" ? "light" : `theme-${colorScheme}`

  // Función para cambiar el esquema de color
  const handleSetColorScheme = (newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme)
    // Actualizar tokens inmediatamente
    const newTokens = createColorTokens(newColorScheme, mode)
    setColorTokensState(newTokens)
    updateColorTokens(newTokens)
  }

  // Función para cambiar el modo
  const handleSetMode = (newMode: Mode) => {
    setMode(newMode)
    // Actualizar tokens inmediatamente
    const newTokens = createColorTokens(colorScheme, newMode)
    setColorTokensState(newTokens)
    updateColorTokens(newTokens)
  }

  const setTheme = (newTheme: string) => {
    if (newTheme === "dark") {
      handleSetMode("dark")
      // Mantener el esquema de color actual
    } else if (newTheme === "light") {
      handleSetMode("light")
      handleSetColorScheme("blue")
    } else if (newTheme === "theme-green") {
      handleSetMode("light")
      handleSetColorScheme("green")
    } else if (newTheme === "theme-orange") {
      handleSetMode("light")
      handleSetColorScheme("orange")
    }
  }

  // Efecto para actualizar los tokens de color cuando cambia el esquema o modo
  useEffect(() => {
    const newTokens = createColorTokens(colorScheme, mode)
    setColorTokensState(newTokens)
    // Actualizar la variable global de tokens
    updateColorTokens(newTokens)
  }, [colorScheme, mode])

  // Efecto para cargar preferencias guardadas
  useEffect(() => {
    const storedColorScheme = localStorage.getItem("colorScheme") as ColorScheme
    const storedMode = localStorage.getItem("mode") as Mode

    if (storedColorScheme && ["blue", "green", "orange"].includes(storedColorScheme)) {
      setColorScheme(storedColorScheme)
    }

    if (storedMode && ["light", "dark"].includes(storedMode)) {
      setMode(storedMode)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // Si no hay preferencia guardada, usar la preferencia del sistema
      setMode("dark")
    }

    // Actualizar tokens con los valores cargados
    const newTokens = createColorTokens(
      storedColorScheme && ["blue", "green", "orange"].includes(storedColorScheme) ? storedColorScheme : "blue",
      storedMode && ["light", "dark"].includes(storedMode) ? storedMode : "light",
    )
    setColorTokensState(newTokens)
    updateColorTokens(newTokens)
  }, [])

  // Efecto para aplicar el tema mediante CSS (compatibilidad con el sistema actual)
  useEffect(() => {
    const root = window.document.documentElement

    // Eliminar todas las clases de tema
    root.classList.remove("dark", "theme-blue", "theme-green", "theme-orange")

    // Aplicar el modo oscuro si corresponde
    if (mode === "dark") {
      root.classList.add("dark")
    }

    // Aplicar el esquema de color (siempre, incluso en modo oscuro)
    if (colorScheme !== "blue") {
      root.classList.add(`theme-${colorScheme}`)
    }

    // Guardar preferencias
    localStorage.setItem("colorScheme", colorScheme)
    localStorage.setItem("mode", mode)
  }, [colorScheme, mode])

  const value = {
    colorScheme,
    mode,
    setColorScheme: handleSetColorScheme,
    setMode: handleSetMode,
    colorTokens: colorTokensState,
    // Para compatibilidad
    theme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
