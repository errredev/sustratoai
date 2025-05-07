"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "@/app/theme-provider"
import { generatePageBackgroundTokens, type PageBackgroundVariant } from "@/lib/theme/components/page-background-tokens"

interface PageBackgroundProps {
  children: React.ReactNode
  variant?: PageBackgroundVariant
  className?: string
}

export function PageBackground({ children, variant = "minimal", className = "" }: PageBackgroundProps) {
  const { colorScheme, mode } = useTheme()
  const [style, setStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    // Obtener el tema actual
    const currentTheme = colorScheme || "blue"

    // Generar tokens para el fondo según la variante, tema y modo
    const tokens = generatePageBackgroundTokens(currentTheme as any, mode, variant)

    // Aplicar los tokens como estilos
    setStyle({
      backgroundColor: tokens.background,
      backgroundImage: tokens.backgroundImage,
    })
  }, [colorScheme, mode, variant])

  // Aplicar clases para asegurar que cubra toda la pantalla
  const baseClasses = `fixed inset-0 w-full h-full min-h-screen overflow-auto ${mode === "dark" ? "dark" : ""} ${className}`

  return (
    <div className={baseClasses} style={style}>
      {children}
    </div>
  )
}
