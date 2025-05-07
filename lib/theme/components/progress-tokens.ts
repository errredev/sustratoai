import { colors } from "@/lib/theme/colors"
import type { ColorScheme, Mode } from "@/lib/theme/color-tokens"

export type ProgressVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "termometro"
export type ProgressSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface ProgressTokens {
  trackColor: string
  barColor: string
  barGradient: string
  accentGradient: string
  borderRadius: string
  transition: string
}

/**
 * Genera los tokens para el componente Progress
 */
export function generateProgressTokens(
  colorScheme: ColorScheme = "blue",
  mode: Mode = "light",
  variant: ProgressVariant = "primary",
): ProgressTokens {
  const isDark = mode === "dark"
  const themeColors = colors.themes[colorScheme]
  const semanticColors = colors.semantic
  const accentColor = semanticColors.accent

  // Función para obtener los colores base según la variante
  const getBaseColors = () => {
    switch (variant) {
      case "primary": {
        const mainColor = isDark ? themeColors.primary.pureDark : themeColors.primary.pure
        const secondColor = isDark ? themeColors.secondary.pureDark : themeColors.secondary.pure
        return {
          track: isDark ? `${themeColors.primary.bgDark}40` : `${themeColors.primary.bg}80`,
          bar: mainColor,
          gradient: `linear-gradient(90deg, ${mainColor}, ${secondColor})`,
          accentGradient: `linear-gradient(90deg, ${mainColor}, ${accentColor.pure})`,
        }
      }
      case "secondary": {
        const mainColor = isDark ? themeColors.secondary.pureDark : themeColors.secondary.pure
        const primaryColor = isDark ? themeColors.primary.pureDark : themeColors.primary.pure
        return {
          track: isDark ? `${themeColors.secondary.bgDark}40` : `${themeColors.secondary.bg}80`,
          bar: mainColor,
          gradient: `linear-gradient(90deg, ${primaryColor}, ${mainColor})`,
          accentGradient: `linear-gradient(90deg, ${mainColor}, ${accentColor.pure})`,
        }
      }
      case "tertiary": {
        const mainColor = isDark ? themeColors.tertiary.pureDark : themeColors.tertiary.pure
        const secondaryColor = isDark ? themeColors.secondary.pureDark : themeColors.secondary.pure
        return {
          track: isDark ? `${themeColors.tertiary.bgDark}40` : `${themeColors.tertiary.bg}80`,
          bar: mainColor,
          gradient: `linear-gradient(90deg, ${secondaryColor}, ${mainColor})`,
          accentGradient: `linear-gradient(90deg, ${mainColor}, ${accentColor.pure})`,
        }
      }
      case "accent": {
        const mainColor = isDark ? semanticColors.accent.pureDark : semanticColors.accent.pure
        const primaryColor = isDark ? themeColors.primary.pureDark : themeColors.primary.pure
        return {
          track: isDark ? `${semanticColors.accent.bgDark}40` : `${semanticColors.accent.bg}80`,
          bar: mainColor,
          gradient: `linear-gradient(90deg, ${primaryColor}, ${mainColor})`,
          accentGradient: `linear-gradient(90deg, ${mainColor}, ${primaryColor})`,
        }
      }
      case "success": {
        const mainColor = isDark ? semanticColors.success.pureDark : semanticColors.success.pure
        const accentColor = isDark ? semanticColors.accent.pureDark : semanticColors.accent.pure
        return {
          track: isDark ? `${semanticColors.success.bgDark}40` : `${semanticColors.success.bg}80`,
          bar: mainColor,
          gradient: `linear-gradient(90deg, ${accentColor}, ${mainColor})`,
          accentGradient: `linear-gradient(90deg, ${mainColor}, ${accentColor})`,
        }
      }
      case "warning": {
        const mainColor = isDark ? semanticColors.warning.pureDark : semanticColors.warning.pure
        const dangerColor = isDark ? semanticColors.danger.pureDark : semanticColors.danger.pure
        return {
          track: isDark ? `${semanticColors.warning.bgDark}40` : `${semanticColors.warning.bg}80`,
          bar: mainColor,
          gradient: `linear-gradient(90deg, ${dangerColor}, ${mainColor})`,
          accentGradient: `linear-gradient(90deg, ${mainColor}, ${accentColor.pure})`,
        }
      }
      case "danger": {
        const mainColor = isDark ? semanticColors.danger.pureDark : semanticColors.danger.pure
        const warningColor = isDark ? semanticColors.warning.pureDark : semanticColors.warning.pure
        return {
          track: isDark ? `${semanticColors.danger.bgDark}40` : `${semanticColors.danger.bg}80`,
          bar: mainColor,
          gradient: `linear-gradient(90deg, ${mainColor}, ${warningColor})`,
          accentGradient: `linear-gradient(90deg, ${mainColor}, ${accentColor.pure})`,
        }
      }
      case "neutral": {
        const darkColor = isDark ? colors.neutral.gray[400] : colors.neutral.gray[600]
        const lightColor = isDark ? colors.neutral.gray[600] : colors.neutral.gray[400]
        return {
          track: isDark ? `${colors.neutral.gray[700]}40` : `${colors.neutral.gray[200]}80`,
          bar: darkColor,
          gradient: `linear-gradient(90deg, ${darkColor}, ${lightColor})`,
          accentGradient: `linear-gradient(90deg, ${darkColor}, ${accentColor.pure})`,
        }
      }
      case "termometro": {
        const dangerColor = isDark ? semanticColors.danger.pureDark : semanticColors.danger.pure
        const warningColor = isDark ? semanticColors.warning.pureDark : semanticColors.warning.pure
        const successColor = isDark ? semanticColors.success.pureDark : semanticColors.success.pure
        return {
          track: isDark ? `${colors.neutral.gray[700]}40` : `${colors.neutral.gray[200]}80`,
          bar: warningColor, // Color base (no se usa directamente)
          gradient: `linear-gradient(90deg, ${dangerColor}, ${warningColor}, ${successColor})`,
          accentGradient: `linear-gradient(90deg, ${dangerColor}, ${accentColor.pure}, ${successColor})`,
        }
      }
      default: {
        const mainColor = isDark ? themeColors.primary.pureDark : themeColors.primary.pure
        const secondColor = isDark ? themeColors.secondary.pureDark : themeColors.secondary.pure
        return {
          track: isDark ? `${themeColors.primary.bgDark}40` : `${themeColors.primary.bg}80`,
          bar: mainColor,
          gradient: `linear-gradient(90deg, ${mainColor}, ${secondColor})`,
          accentGradient: `linear-gradient(90deg, ${mainColor}, ${accentColor.pure})`,
        }
      }
    }
  }

  const baseColors = getBaseColors()

  return {
    trackColor: baseColors.track,
    barColor: baseColors.bar,
    barGradient: baseColors.gradient,
    accentGradient: baseColors.accentGradient,
    borderRadius: "9999px", // Siempre redondeado
    transition: "width 0.3s ease-in-out",
  }
}
