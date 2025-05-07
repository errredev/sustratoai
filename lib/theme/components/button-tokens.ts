import tinycolor from "tinycolor2"
import type { ColorScheme, Mode } from "../color-tokens"
import colors from "../colors"

// Definimos los tipos para las variantes y tamaños
export type ButtonVariant = "solid" | "outline" | "ghost" | "link" | "subtle"
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"
export type ButtonColor = "default" | "primary" | "secondary" | "tertiary" | "accent" | "success" | "warning" | "danger"
export type ButtonRounded = "none" | "sm" | "md" | "lg" | "full"

// Estructura completa de tokens para el botón
export type ButtonTokens = {
  base: {
    padding: Record<ButtonSize, string>
    borderRadius: Record<ButtonRounded, string>
    fontSize: Record<ButtonSize, string>
    height: Record<ButtonSize, string>
    iconSize: Record<ButtonSize, string>
    transition: string
    fontWeight: string
    gap: Record<ButtonSize, string>
  }
  variants: {
    [key in ButtonVariant]: {
      default: {
        background: string
        color: string
        border: string
        boxShadow: string
      }
      hover: {
        background: string
        color: string
        border: string
        boxShadow: string
        transform: string
      }
      active: {
        background: string
        color: string
        border: string
        boxShadow: string
        transform: string
      }
      focus: {
        outline: string
        ring: string
      }
      disabled: {
        background: string
        color: string
        border: string
        opacity: string
        cursor: string
      }
    }
  }
  colors: {
    [key in ButtonColor]: {
      background: string
      color: string
      border: string
      gradient: string
      hoverBackground: string
      hoverColor: string
      hoverBorder: string
      activeBackground: string
      activeColor: string
      activeBorder: string
      // Nuevos tokens para ghost y outline
      ghostColor: string
      ghostBorder: string
      outlineColor: string
      outlineBorder: string
      // Nuevo token para el efecto ripple
      rippleColor: string
    }
  }
  loading: {
    spinnerColor: string
    spinnerSize: Record<ButtonSize, string>
    opacity: string
  }
}

// Función para generar los tokens del botón
export function generateButtonTokens(colorScheme: ColorScheme, mode: Mode): ButtonTokens {
  const isDark = mode === "dark"
  const themeColors = colors.themes[colorScheme]
  const semanticColors = colors.semantic

  // Función para ajustar colores basados en el modo
  const adjustColor = (color: string, darken: number, lighten: number) => {
    if (isDark) {
      return tinycolor(color).lighten(lighten).toString()
    }
    return tinycolor(color).darken(darken).toString()
  }

  // Función para crear un gradiente
  const createGradient = (color: string) => {
    const baseColor = tinycolor(color)
    const lighterColor = baseColor.clone().lighten(10).toString()
    const darkerColor = baseColor.clone().darken(10).toString()

    return isDark
      ? `linear-gradient(to bottom right, ${color}, ${lighterColor})`
      : `linear-gradient(to bottom right, ${lighterColor}, ${color})`
  }

  // Modificar la función hexToRgb para asegurar que siempre devuelva un valor
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
      : "0, 0, 0" // Valor por defecto en caso de error
  }

  // Colores base
  const primaryColor = isDark ? themeColors.primary.pureDark : themeColors.primary.pure
  const secondaryColor = isDark ? themeColors.secondary.pureDark : themeColors.secondary.pure
  const tertiaryColor = isDark ? themeColors.tertiary.pureDark : themeColors.tertiary.pure
  const accentColor = isDark ? semanticColors.accent.pureDark : semanticColors.accent.pure
  const successColor = isDark ? semanticColors.success.pureDark : semanticColors.success.pure
  const warningColor = isDark ? semanticColors.warning.pureDark : semanticColors.warning.pure
  const dangerColor = isDark ? semanticColors.danger.pureDark : semanticColors.danger.pure
  const defaultColor = isDark ? colors.neutral.gray[600] : colors.neutral.gray[200]

  // Colores de texto
  const primaryTextColor = isDark ? colors.neutral.white : colors.neutral.white
  const defaultTextColor = isDark ? colors.neutral.gray[200] : colors.neutral.gray[800]

  // Colores específicos para texto de botones
  const successTextColor = semanticColors.success.text || semanticColors.success.pure
  const warningTextColor = semanticColors.warning.text || semanticColors.warning.pure
  // Para danger, usamos el color puro para ghost/outline y el color de fondo más claro para solid
  const dangerPureColor = semanticColors.danger.pure
  const dangerLightColor = isDark
    ? tinycolor(semanticColors.danger.pureDark).lighten(20).toString()
    : tinycolor(semanticColors.danger.pure).lighten(30).toString()
  const tertiaryTextColor = themeColors.tertiary.text || themeColors.tertiary.pure

  // Colores para el efecto ripple
  const primaryRippleColor = themeColors.primary.bg
  const secondaryRippleColor = themeColors.secondary.bg
  const tertiaryRippleColor = themeColors.tertiary.bg
  const accentRippleColor = semanticColors.accent.bg
  const successRippleColor = semanticColors.success.bg
  const warningRippleColor = semanticColors.warning.bg
  const dangerRippleColor = semanticColors.danger.bg
  const defaultRippleColor = colors.neutral.gray[300]

  // Tokens base
  const baseTokens = {
    padding: {
      xs: "0.5rem 0.75rem",
      sm: "0.625rem 1rem",
      md: "0.75rem 1.25rem",
      lg: "0.875rem 1.5rem",
      xl: "1rem 1.75rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      full: "9999px",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "0.875rem",
      lg: "1rem",
      xl: "1.125rem",
    },
    height: {
      xs: "1.75rem",
      sm: "2rem",
      md: "2.5rem",
      lg: "3rem",
      xl: "3.5rem",
    },
    iconSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.25rem",
      xl: "1.5rem",
    },
    gap: {
      xs: "0.25rem",
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.625rem",
      xl: "0.75rem",
    },
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    fontWeight: "500",
  }

  // Variantes
  const variantTokens = {
    solid: {
      default: {
        background: "currentBackground",
        color: "currentColor",
        border: "none",
        boxShadow: isDark ? "0 1px 3px 0 rgba(0, 0, 0, 0.3)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      },
      hover: {
        background: "currentHoverBackground",
        color: "currentHoverColor",
        border: "none",
        boxShadow: isDark
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transform: "translateY(-1px)",
      },
      active: {
        background: "currentActiveBackground",
        color: "currentActiveColor",
        border: "none",
        boxShadow: isDark ? "0 1px 2px 0 rgba(0, 0, 0, 0.3)" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        transform: "translateY(1px)",
      },
      focus: {
        outline: "none",
        ring: isDark
          ? `0 0 0 2px ${tinycolor(primaryColor).setAlpha(0.5).toString()}`
          : `0 0 0 2px ${tinycolor(primaryColor).setAlpha(0.4).toString()}`,
      },
      disabled: {
        background: isDark ? colors.neutral.gray[700] : colors.neutral.gray[200],
        color: isDark ? colors.neutral.gray[500] : colors.neutral.gray[400],
        border: "none",
        opacity: "0.6",
        cursor: "not-allowed",
      },
    },
    outline: {
      default: {
        background: "transparent",
        color: "currentOutlineColor",
        border: "1px solid currentOutlineBorder",
        boxShadow: "none",
      },
      hover: {
        background: "rgba(currentRgb, 0.3)", // Aumentado significativamente de 0.15 a 0.3
        color: "currentHoverColor",
        border: "1px solid currentHoverBorder",
        boxShadow: isDark ? "0 2px 4px -1px rgba(0, 0, 0, 0.3)" : "0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transform: "translateY(-1px)",
      },
      active: {
        background: "rgba(currentRgb, 0.4)", // Aumentado significativamente de 0.25 a 0.4
        color: "currentActiveColor",
        border: "1px solid currentActiveBorder",
        boxShadow: "none",
        transform: "translateY(1px)",
      },
      focus: {
        outline: "none",
        ring: isDark
          ? `0 0 0 2px ${tinycolor(primaryColor).setAlpha(0.5).toString()}`
          : `0 0 0 2px ${tinycolor(primaryColor).setAlpha(0.4).toString()}`,
      },
      disabled: {
        background: "transparent",
        color: isDark ? colors.neutral.gray[500] : colors.neutral.gray[400],
        border: `1px solid ${isDark ? colors.neutral.gray[600] : colors.neutral.gray[300]}`,
        opacity: "0.6",
        cursor: "not-allowed",
      },
    },
    ghost: {
      default: {
        background: "transparent",
        color: "currentGhostColor",
        border: "none",
        boxShadow: "none",
      },
      hover: {
        background: "rgba(currentRgb, 0.3)", // Aumentado significativamente de 0.15 a 0.3
        color: "currentHoverColor",
        border: "none",
        boxShadow: "none",
        transform: "translateY(-1px)",
      },
      active: {
        background: "rgba(currentRgb, 0.4)", // Aumentado significativamente de 0.25 a 0.4
        color: "currentActiveColor",
        border: "none",
        boxShadow: "none",
        transform: "translateY(1px)",
      },
      focus: {
        outline: "none",
        ring: isDark
          ? `0 0 0 2px ${tinycolor(primaryColor).setAlpha(0.4).toString()}`
          : `0 0 0 2px ${tinycolor(primaryColor).setAlpha(0.3).toString()}`,
      },
      disabled: {
        background: "transparent",
        color: isDark ? colors.neutral.gray[500] : colors.neutral.gray[400],
        border: "none",
        opacity: "0.6",
        cursor: "not-allowed",
      },
    },
    link: {
      default: {
        background: "transparent",
        color: "currentColor",
        border: "none",
        boxShadow: "none",
      },
      hover: {
        background: "transparent",
        color: "currentHoverColor",
        border: "none",
        boxShadow: "none",
        transform: "none",
      },
      active: {
        background: "transparent",
        color: "currentActiveColor",
        border: "none",
        boxShadow: "none",
        transform: "none",
      },
      focus: {
        outline: "none",
        ring: "none",
      },
      disabled: {
        background: "transparent",
        color: isDark ? colors.neutral.gray[500] : colors.neutral.gray[400],
        border: "none",
        opacity: "0.6",
        cursor: "not-allowed",
      },
    },
    subtle: {
      default: {
        background: "rgba(currentRgb, 0.25)", // Aumentado de 0.2 a 0.25
        color: "currentColor",
        border: "none",
        boxShadow: "none",
      },
      hover: {
        background: "rgba(currentRgb, 0.4)", // Aumentado significativamente de 0.3 a 0.4
        color: "currentHoverColor",
        border: "none",
        boxShadow: isDark ? "0 2px 4px -1px rgba(0, 0, 0, 0.2)" : "0 2px 4px -1px rgba(0, 0, 0, 0.05)",
        transform: "translateY(-1px)",
      },
      active: {
        background: "rgba(currentRgb, 0.5)", // Aumentado significativamente de 0.4 a 0.5
        color: "currentActiveColor",
        border: "none",
        boxShadow: "none",
        transform: "translateY(1px)",
      },
      focus: {
        outline: "none",
        ring: isDark
          ? `0 0 0 2px ${tinycolor(primaryColor).setAlpha(0.4).toString()}`
          : `0 0 0 2px ${tinycolor(primaryColor).setAlpha(0.3).toString()}`,
      },
      disabled: {
        background: isDark ? colors.neutral.gray[800] : colors.neutral.gray[100],
        color: isDark ? colors.neutral.gray[500] : colors.neutral.gray[400],
        border: "none",
        opacity: "0.6",
        cursor: "not-allowed",
      },
    },
  }

  // En la sección de colorTokens, modificar el objeto default para aumentar la opacidad en hover
  const colorTokens = {
    default: {
      background: defaultColor,
      color: defaultTextColor,
      // Usar un borde más oscuro para mayor contraste
      border: isDark ? colors.neutral.gray[400] : colors.neutral.gray[400],
      gradient: createGradient(defaultColor),
      // Usar colores más contrastantes para hover
      hoverBackground: isDark ? colors.neutral.gray[500] : colors.neutral.gray[300],
      hoverColor: defaultTextColor,
      hoverBorder: isDark ? colors.neutral.gray[300] : colors.neutral.gray[500],
      // Usar colores más contrastantes para active
      activeBackground: isDark ? colors.neutral.gray[400] : colors.neutral.gray[400],
      activeColor: defaultTextColor,
      activeBorder: isDark ? colors.neutral.gray[200] : colors.neutral.gray[600],
      // Aumentar significativamente el contraste para ghost y outline
      ghostColor: isDark ? colors.neutral.white : colors.neutral.gray[900],
      ghostBorder: isDark ? colors.neutral.gray[300] : colors.neutral.gray[500],
      outlineColor: isDark ? colors.neutral.white : colors.neutral.gray[900],
      outlineBorder: isDark ? colors.neutral.gray[300] : colors.neutral.gray[500],
      rippleColor: defaultRippleColor,
    },
    primary: {
      background: primaryColor,
      color: primaryTextColor,
      border: primaryColor,
      gradient: createGradient(primaryColor),
      hoverBackground: adjustColor(primaryColor, 10, 10),
      hoverColor: primaryTextColor,
      hoverBorder: adjustColor(primaryColor, 10, 10),
      activeBackground: adjustColor(primaryColor, 15, 15),
      activeColor: primaryTextColor,
      activeBorder: adjustColor(primaryColor, 15, 15),
      ghostColor: primaryColor,
      ghostBorder: primaryColor,
      outlineColor: primaryColor,
      outlineBorder: primaryColor,
      rippleColor: primaryRippleColor,
    },
    secondary: {
      background: secondaryColor,
      color: primaryTextColor,
      border: secondaryColor,
      gradient: createGradient(secondaryColor),
      hoverBackground: adjustColor(secondaryColor, 10, 10),
      hoverColor: primaryTextColor,
      hoverBorder: adjustColor(secondaryColor, 10, 10),
      activeBackground: adjustColor(secondaryColor, 15, 15),
      activeColor: primaryTextColor,
      activeBorder: adjustColor(secondaryColor, 15, 15),
      ghostColor: secondaryColor,
      ghostBorder: secondaryColor,
      outlineColor: secondaryColor,
      outlineBorder: secondaryColor,
      rippleColor: secondaryRippleColor,
    },
    tertiary: {
      background: tertiaryColor,
      color: primaryTextColor,
      border: tertiaryColor,
      gradient: createGradient(tertiaryColor),
      hoverBackground: adjustColor(tertiaryColor, 10, 10),
      hoverColor: primaryTextColor,
      hoverBorder: adjustColor(tertiaryColor, 10, 10),
      activeBackground: adjustColor(tertiaryColor, 15, 15),
      activeColor: primaryTextColor,
      activeBorder: adjustColor(tertiaryColor, 15, 15),
      ghostColor: tertiaryTextColor,
      ghostBorder: tertiaryColor,
      outlineColor: tertiaryTextColor,
      outlineBorder: tertiaryColor,
      rippleColor: tertiaryRippleColor,
    },
    accent: {
      background: accentColor,
      color: primaryTextColor,
      border: accentColor,
      gradient: createGradient(accentColor),
      hoverBackground: adjustColor(accentColor, 10, 10),
      hoverColor: primaryTextColor,
      hoverBorder: adjustColor(accentColor, 10, 10),
      activeBackground: adjustColor(accentColor, 15, 15),
      activeColor: primaryTextColor,
      activeBorder: adjustColor(accentColor, 15, 15),
      ghostColor: accentColor,
      ghostBorder: accentColor,
      outlineColor: accentColor,
      outlineBorder: accentColor,
      rippleColor: accentRippleColor,
    },
    success: {
      background: successColor,
      color: successTextColor, // Usar el color de texto específico para success
      border: successColor,
      gradient: createGradient(successColor),
      hoverBackground: adjustColor(successColor, 10, 10),
      hoverColor: successTextColor,
      hoverBorder: adjustColor(successColor, 10, 10),
      activeBackground: adjustColor(successColor, 15, 15),
      activeColor: successTextColor,
      activeBorder: adjustColor(successColor, 15, 15),
      ghostColor: successTextColor,
      ghostBorder: successColor,
      outlineColor: successTextColor,
      outlineBorder: successColor,
      rippleColor: successRippleColor,
    },
    warning: {
      background: warningColor,
      color: warningTextColor, // Usar el color de texto específico para warning
      border: warningColor,
      gradient: createGradient(warningColor),
      hoverBackground: adjustColor(warningColor, 10, 10),
      hoverColor: warningTextColor,
      hoverBorder: adjustColor(warningColor, 10, 10),
      activeBackground: adjustColor(warningColor, 15, 15),
      activeColor: warningTextColor,
      activeBorder: adjustColor(warningColor, 15, 15),
      ghostColor: warningTextColor,
      ghostBorder: warningColor,
      outlineColor: warningTextColor,
      outlineBorder: warningColor,
      rippleColor: warningRippleColor,
    },
    danger: {
      background: dangerColor,
      color: dangerLightColor, // Usar el color más claro para el texto en botones solid
      border: dangerColor,
      gradient: createGradient(dangerColor),
      hoverBackground: adjustColor(dangerColor, 10, 10),
      hoverColor: dangerLightColor,
      hoverBorder: adjustColor(dangerColor, 10, 10),
      activeBackground: adjustColor(dangerColor, 15, 15),
      activeColor: dangerLightColor,
      activeBorder: adjustColor(dangerColor, 15, 15),
      ghostColor: dangerPureColor, // Usar el color puro para ghost
      ghostBorder: dangerColor,
      outlineColor: dangerPureColor, // Usar el color puro para outline
      outlineBorder: dangerColor,
      rippleColor: dangerRippleColor,
    },
  }

  // Loading
  const loadingTokens = {
    spinnerColor: "currentColor",
    spinnerSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.25rem",
      xl: "1.5rem",
    },
    opacity: "0.7",
  }

  return {
    base: baseTokens,
    variants: variantTokens,
    colors: colorTokens,
    loading: loadingTokens,
  }
}
