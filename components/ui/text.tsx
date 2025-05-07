"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { useColorTokens } from "@/hooks/use-color-tokens"
import { useFontTheme } from "@/app/font-provider"
import type {
  TextVariant,
  TextSize,
  TextWeight,
  TextAlign,
  TextColor,
  ColorVariant,
  GradientType,
} from "@/lib/theme/components/text-tokens"

// Tipo para la fuente del par a utilizar
export type FontPairType = "heading" | "body"

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant
  size?: TextSize
  weight?: TextWeight
  align?: TextAlign
  as?: React.ElementType
  truncate?: boolean
  gradient?: GradientType
  color?: TextColor
  colorVariant?: ColorVariant
  className?: string
  children: React.ReactNode
  useHeadingFont?: boolean // Prop anterior (mantenida por compatibilidad)
  fontType?: FontPairType // Nueva prop para especificar explícitamente qué tipo de fuente usar
}

export function Text({
  variant = "default",
  size,
  weight,
  align,
  as: Component = "p",
  truncate = false,
  gradient = false,
  color,
  colorVariant = "text",
  className,
  children,
  useHeadingFont, // Mantenida por compatibilidad
  fontType, // Nueva prop
  ...props
}: TextProps) {
  const { component } = useColorTokens()
  const { fontTheme } = useFontTheme()
  const textTokens = component.text

  // Defaults de tamaño/peso/color
  const variantDefaults = textTokens.variants[variant]
  const finalSize = size || variantDefaults.size
  const finalWeight = weight || variantDefaults.weight
  const finalColor = color || variantDefaults.color

  // Determinar qué tipo de fuente usar basado en la variante y props
  const determineFontType = (): FontPairType => {
    // Si se especifica explícitamente fontType, usar ese
    if (fontType) return fontType

    // Si se usa la prop anterior useHeadingFont, respetarla
    if (useHeadingFont !== undefined) return useHeadingFont ? "heading" : "body"

    // Si el componente es un h1-h6, usar fuente de heading
    if (typeof Component === "string" && Component.startsWith("h") && Component.length === 2) {
      return "heading"
    }

    // Determinar por variante
    switch (variant) {
      case "heading":
      case "title":
      case "subheading":
        return "heading"
      case "subtitle":
        return "heading" // También podría ser "body" dependiendo del diseño deseado
      case "default":
      case "label":
      case "caption":
      case "muted":
        return "body"
      default:
        return "body"
    }
  }

  // Obtener el tipo de fuente final
  const finalFontType = determineFontType()

  // Mapas de clases Tailwind
  const sizeStyles: Record<TextSize, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  }
  const weightStyles: Record<TextWeight, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  }
  const alignStyles: Record<TextAlign, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }
  const variantStyles: Record<TextVariant, string> = {
    default: "",
    heading: "tracking-tight",
    subheading: "",
    title: "",
    subtitle: "",
    label: "",
    caption: "",
    muted: "",
  }

  const classes = cn(
    variantStyles[variant],
    sizeStyles[finalSize],
    weightStyles[finalWeight],
    align && alignStyles[align],
    truncate && "truncate",
    className,
  )

  const getTextColor = () => {
    if (!textTokens?.colors) return "inherit"
    const token = textTokens.colors[finalColor]
    return token ? token[colorVariant] || token.text : "inherit"
  }

  // Estilo base que incluye la fuente
  const baseStyle: React.CSSProperties = {
    color: getTextColor(),
    fontFamily: finalFontType === "heading" ? "var(--font-family-headings)" : "var(--font-family-base)",
    fontWeight: finalFontType === "heading" ? "var(--font-weight-headings)" : "var(--font-weight-base)",
    letterSpacing: finalFontType === "heading" ? "var(--letter-spacing-headings)" : "var(--letter-spacing-body)",
    lineHeight: "var(--line-height)",
  }

  // Si no hay gradiente, texto normal
  if (!gradient) {
    return (
      <Component className={classes} style={baseStyle} {...props}>
        {children}
      </Component>
    )
  }

  // Gradiente: obtener colores
  if (!textTokens?.gradients) {
    // fallback a color sólido
    return (
      <Component className={classes} style={baseStyle} {...props}>
        {children}
      </Component>
    )
  }

  const gradientType = gradient === true ? "primary" : gradient
  const gradientColors = textTokens.gradients[gradientType as Exclude<TextColor, "default" | "muted" | "neutral">]
  if (!gradientColors) {
    // fallback
    return (
      <Component className={classes} style={baseStyle} {...props}>
        {children}
      </Component>
    )
  }

  // Estilo del <span> gradiente con correcciones para evitar el recorte de caracteres
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(
      to right,
      ${gradientColors.start},
      ${gradientColors.middle} 50%,
      ${gradientColors.end}
    )`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
    fontFamily: finalFontType === "heading" ? "var(--font-family-headings)" : "var(--font-family-base)",
    fontWeight: finalFontType === "heading" ? "var(--font-weight-headings)" : "var(--font-weight-base)",
    letterSpacing: finalFontType === "heading" ? "var(--letter-spacing-headings)" : "var(--letter-spacing-body)",
    lineHeight: "var(--line-height)",
    paddingBottom: "0.1em", // Añadir un pequeño padding inferior para evitar recortes
    display: "inline", // Mantener el comportamiento inline original
  }

  // Mantener el estilo original del contenedor para preservar el comportamiento de salto de línea
  const containerStyle: React.CSSProperties = {
    fontFamily: finalFontType === "heading" ? "var(--font-family-headings)" : "var(--font-family-base)",
    fontWeight: finalFontType === "heading" ? "var(--font-weight-headings)" : "var(--font-weight-base)",
    letterSpacing: finalFontType === "heading" ? "var(--letter-spacing-headings)" : "var(--letter-spacing-body)",
    lineHeight: "var(--line-height)",
    // No cambiamos el display para mantener el comportamiento original
  }

  return (
    <Component className={classes} style={containerStyle} {...props}>
      <span style={gradientStyle}>{children}</span>
    </Component>
  )
}
