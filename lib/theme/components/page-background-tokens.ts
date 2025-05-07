import type { ColorScheme, Mode } from "../color-tokens"
import colors from "../colors"

// Tipos de variantes para PageBackground
export type PageBackgroundVariant = "default" | "gradient" | "subtle" | "minimal"

// Estructura de tokens para PageBackground
export type PageBackgroundTokens = {
  background: string
  backgroundImage: string
}

/**
 * Genera los tokens para PageBackground según la variante, esquema de color y modo
 */
export function generatePageBackgroundTokens(
  colorScheme: ColorScheme,
  mode: Mode,
  variant: PageBackgroundVariant,
): PageBackgroundTokens {
  const isDark = mode === "dark"
  const themeColors = colors.themes[colorScheme]

  // Color de fondo base según el modo
  const baseBackground = isDark ? "#050709" : "hsl(var(--background))"

  // Obtener colores primarios y terciarios según el tema y modo
  const primaryColor = isDark ? themeColors.primary.bgDark : themeColors.primary.bg
  const secondaryColor = isDark ? themeColors.secondary.bgDark : themeColors.secondary.bg
  const tertiaryColor = isDark ? themeColors.tertiary.bgDark : themeColors.tertiary.bg

  // Opacidades estandarizadas para todos los temas
  // Ajustamos las opacidades para que los colores sean más visibles según el tema
  const primaryOpacity = variant === "gradient" && isDark ? "20" : isDark ? "25" : "35"
  const secondaryOpacity = variant === "gradient" && isDark ? "15" : isDark ? "20" : "30"
  const tertiaryOpacity = variant === "gradient" && isDark ? "15" : isDark ? "20" : "25"
  const subtleOpacity = isDark ? "15" : "20"
  const minimalOpacity = isDark ? "10" : "15"

  // Generar tokens según la variante
  switch (variant) {
    case "gradient":
      return {
        background: baseBackground,
        backgroundImage: `
          radial-gradient(circle at top right, ${primaryColor}${primaryOpacity}, transparent ${isDark ? "60%" : "70%"}), 
          radial-gradient(circle at center, ${secondaryColor}${secondaryOpacity}, transparent ${isDark ? "50%" : "60%"}),
          radial-gradient(circle at bottom left, ${tertiaryColor}${tertiaryOpacity}, transparent ${isDark ? "60%" : "70%"})
        `,
      }

    case "subtle":
      return {
        background: baseBackground,
        backgroundImage: `
          radial-gradient(circle at top right, ${primaryColor}${subtleOpacity}, transparent 70%),
          radial-gradient(circle at bottom left, ${tertiaryColor}${subtleOpacity}, transparent 70%)
        `,
      }

    case "minimal":
      return {
        background: baseBackground,
        backgroundImage: isDark
          ? `linear-gradient(to bottom, ${primaryColor}${minimalOpacity}, transparent 70%)`
          : `linear-gradient(to bottom, ${primaryColor}${minimalOpacity}, ${primaryColor}${minimalOpacity})`,
      }

    // default
    default:
      return {
        background: baseBackground,
        backgroundImage: `linear-gradient(to bottom, ${primaryColor}${minimalOpacity}, transparent 80%)`,
      }
  }
}
