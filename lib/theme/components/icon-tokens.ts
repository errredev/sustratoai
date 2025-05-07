import type { ColorScheme, Mode } from "../color-tokens"
import colors from "../colors"
import tinycolor from "tinycolor2"

// Tipos para los tokens de iconos
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
export type IconColor =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "white"

export type IconColorToken = {
  pure: string
  text: string
  dark: string
  bg: string
}

export type IconTokens = {
  colors: Record<IconColor, IconColorToken>
}

/**
 * Asegura que un color tenga suficiente contraste contra un fondo
 * @param color Color a ajustar
 * @param background Color de fondo
 * @param minRatio Ratio mínimo de contraste (WCAG recomienda 4.5:1)
 * @returns Color ajustado con suficiente contraste
 */
function ensureContrast(color: string, background: string, minRatio = 4.5): string {
  let tc = tinycolor(color)
  if (tinycolor.readability(tc, background) >= minRatio) {
    return tc.toHexString()
  }
  const bgIsDark = tinycolor(background).isDark()
  let step = 0
  while (tinycolor.readability(tc, background) < minRatio && step < 20) {
    tc = bgIsDark ? tc.lighten(5) : tc.darken(5)
    step++
  }
  return tc.toHexString()
}

/**
 * Genera los tokens para iconos
 */
export function generateIconTokens(colorScheme: ColorScheme, mode: Mode): IconTokens {
  const isDark = mode === "dark"
  const themeColors = colors.themes[colorScheme]
  const semanticColors = colors.semantic

  // Fondo oscuro sobre el que contrastaremos en modo oscuro
  const darkBackground = colors.neutral.gray[900] || "#000"

  // Función para generar tokens de color con contraste asegurado en modo oscuro
  const generateColorToken = (colorObj: any): IconColorToken => {
    // Valores base
    const baseToken = {
      pure: isDark ? colorObj.pureDark || colorObj.pure : colorObj.pure,
      text: isDark ? colorObj.textDark || colorObj.text : colorObj.text,
      dark: isDark
        ? colorObj.darkDark || colorObj.dark || colorObj.pureDark || colorObj.pure
        : colorObj.dark || colorObj.pure,
      bg: isDark ? colorObj.bgDark || colorObj.bg : colorObj.bg,
    }

    // Si estamos en modo oscuro, aseguramos el contraste
    if (isDark) {
      return {
        pure: ensureContrast(baseToken.pure, darkBackground),
        text: ensureContrast(baseToken.text, darkBackground),
        dark: ensureContrast(baseToken.dark, darkBackground),
        bg: ensureContrast(baseToken.bg, darkBackground),
      }
    }

    return baseToken
  }

  // Generamos los tokens de color para cada variante
  const defaultToken = isDark
    ? {
        pure: ensureContrast(colors.neutral.gray[300], darkBackground),
        text: ensureContrast(colors.neutral.gray[400], darkBackground),
        dark: ensureContrast(colors.neutral.gray[200], darkBackground),
        bg: ensureContrast(colors.neutral.gray[700], darkBackground),
      }
    : {
        pure: colors.neutral.gray[700],
        text: colors.neutral.gray[600],
        dark: colors.neutral.gray[800],
        bg: colors.neutral.gray[200],
      }

  const neutralToken = isDark
    ? {
        pure: ensureContrast(colors.neutral.gray[400], darkBackground),
        text: ensureContrast(colors.neutral.gray[500], darkBackground),
        dark: ensureContrast(colors.neutral.gray[300], darkBackground),
        bg: ensureContrast(colors.neutral.gray[700], darkBackground),
      }
    : {
        pure: colors.neutral.gray[600],
        text: colors.neutral.gray[500],
        dark: colors.neutral.gray[700],
        bg: colors.neutral.gray[200],
      }

  const whiteToken = isDark
    ? {
        pure: ensureContrast(colors.neutral.gray[100], darkBackground),
        text: ensureContrast(colors.neutral.gray[200], darkBackground),
        dark: ensureContrast(colors.neutral.gray[50], darkBackground),
        bg: ensureContrast(colors.neutral.gray[800], darkBackground),
      }
    : {
        pure: colors.neutral.white,
        text: colors.neutral.gray[100],
        dark: colors.neutral.gray[50],
        bg: colors.neutral.gray[50],
      }

  return {
    colors: {
      default: defaultToken,
      primary: generateColorToken(themeColors.primary),
      secondary: generateColorToken(themeColors.secondary),
      tertiary: generateColorToken(themeColors.tertiary),
      accent: generateColorToken(semanticColors.accent),
      success: generateColorToken(semanticColors.success),
      warning: generateColorToken(semanticColors.warning),
      danger: generateColorToken(semanticColors.danger),
      neutral: neutralToken,
      white: whiteToken,
    },
  }
}
