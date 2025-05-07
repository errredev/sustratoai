"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { getAllFontVariables, type FontTheme, fontThemeConfig } from "@/lib/fonts"

// Contexto para el tema de fuentes
type FontThemeContextType = {
  fontTheme: FontTheme
  setFontTheme: (theme: FontTheme) => void
}

const FontThemeContext = createContext<FontThemeContextType | undefined>(undefined)

// Proveedor del tema de fuentes
export function FontThemeProvider({ children }: { children: ReactNode }) {
  const [fontTheme, setFontTheme] = useState<FontTheme>("sustrato")
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Aplicar variables CSS dinámicamente
  useEffect(() => {
    if (mounted) {
      const config = fontThemeConfig[fontTheme]

      // Aplicar variables CSS a nivel de documento
      document.documentElement.style.setProperty("--font-family-headings", config.heading)
      document.documentElement.style.setProperty("--font-family-base", config.body)
      document.documentElement.style.setProperty("--font-weight-headings", config.headingWeight)
      document.documentElement.style.setProperty("--font-weight-base", config.bodyWeight)
      document.documentElement.style.setProperty("--letter-spacing-headings", config.letterSpacingHeadings)
      document.documentElement.style.setProperty("--letter-spacing-body", config.letterSpacingBody)
      document.documentElement.style.setProperty("--line-height", config.lineHeight)

      // Forzar la actualización de las fuentes en elementos específicos
      document.body.style.fontFamily = config.body
      document.body.style.fontWeight = config.bodyWeight
      document.body.style.letterSpacing = config.letterSpacingBody
      document.body.style.lineHeight = config.lineHeight

      // Aplicar a todos los encabezados
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      headings.forEach((heading) => {
        ;(heading as HTMLElement).style.fontFamily = config.heading
        ;(heading as HTMLElement).style.fontWeight = config.headingWeight
        ;(heading as HTMLElement).style.letterSpacing = config.letterSpacingHeadings
      })

      // Forzar actualización de componentes específicos que podrían no actualizarse automáticamente
      const navbarElements = document.querySelectorAll(".navbar-brand, .navbar-item")
      navbarElements.forEach((element) => {
        ;(element as HTMLElement).style.fontFamily = config.heading
        ;(element as HTMLElement).style.fontWeight = config.headingWeight
      })

      console.log(`Tema de fuente aplicado: ${fontTheme}`, config)
    }
  }, [fontTheme, mounted])

  // Obtener todas las variables de fuente
  const fontVariables = getAllFontVariables()

  return (
    <FontThemeContext.Provider value={{ fontTheme, setFontTheme }}>
      <div className={fontVariables}>{children}</div>
    </FontThemeContext.Provider>
  )
}

// Hook para usar el tema de fuentes
export function useFontTheme() {
  const context = useContext(FontThemeContext)
  if (context === undefined) {
    throw new Error("useFontTheme must be used within a FontThemeProvider")
  }
  return context
}
