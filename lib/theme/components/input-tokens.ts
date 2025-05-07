import colors from "../colors"
import type { ColorScheme, Mode } from "../color-tokens"
import tinycolor from "tinycolor2"

export type InputSize = "sm" | "md" | "lg"
export type InputVariant = "default" | "primary" | "secondary" | "tertiary" | "accent" | "neutral"

export type InputTokens = {
  variants: Record<
    InputVariant,
    {
      background: string
      border: string
      text: string
      placeholder: string
      focusBorder: string
      focusRing: string
      hoverBorder: string
      errorBorder: string
      errorRing: string
      errorBackground: string
      successBorder: string
      successRing: string
      successText: string
      successBackground: string
      iconColor: string
      disabledBackground: string
      disabledBorder: string
      disabledText: string
      editingBackground: string
    }
  >
  sizes: Record<
    InputSize,
    {
      height: string
      fontSize: string
      paddingX: string
      paddingY: string
      iconSize: string
      iconPadding: string
    }
  >
}

export function generateInputTokens(colorScheme: ColorScheme, mode: Mode): InputTokens {
  const isDark = mode === "dark"
  const theme = colors.themes[colorScheme]
  const semantic = colors.semantic
  const neutral = colors.neutral

  // Función para generar variantes
  const generateVariant = (baseColor: {
    pure: string
    pureDark: string
    text: string
    textDark: string
    bg: string
    bgDark: string
  }) => {
    const borderColor = isDark ? tinycolor(baseColor.pureDark).setAlpha(0.5).toRgbString() : baseColor.pure
    const focusBorderColor = isDark ? baseColor.pureDark : baseColor.pure
    const focusRingColor = isDark
      ? tinycolor(baseColor.pureDark).setAlpha(0.2).toRgbString()
      : tinycolor(baseColor.pure).setAlpha(0.2).toRgbString()

    // Fondos con degradado sutil para estados especiales
    const errorBgColor = isDark
      ? tinycolor(semantic.danger.bgDark || "#3B1A1A")
          .setAlpha(0.3)
          .toRgbString()
      : tinycolor(semantic.danger.bg || "#FEF2F2")
          .setAlpha(0.5)
          .toRgbString()

    const successBgColor = isDark
      ? tinycolor(semantic.success.bgDark || "#132E1F")
          .setAlpha(0.3)
          .toRgbString()
      : tinycolor(semantic.success.bg || "#F0FDF4")
          .setAlpha(0.5)
          .toRgbString()

    const editingBgColor = isDark
      ? tinycolor(theme.tertiary.bgDark || "#1F2937")
          .setAlpha(0.3)
          .toRgbString()
      : tinycolor(theme.tertiary.bg || "#F3F4F6")
          .setAlpha(0.5)
          .toRgbString()

    return {
      background: isDark ? neutral.gray[800] : neutral.white,
      border: borderColor,
      text: isDark ? neutral.gray[100] : neutral.gray[900],
      placeholder: isDark ? neutral.gray[500] : neutral.gray[400],
      focusBorder: focusBorderColor,
      focusRing: focusRingColor,
      hoverBorder: isDark
        ? tinycolor(baseColor.pureDark).lighten(10).toString()
        : tinycolor(baseColor.pure).darken(10).toString(),
      errorBorder: isDark ? semantic.danger.pureDark : semantic.danger.pure,
      errorRing: isDark
        ? tinycolor(semantic.danger.pureDark).setAlpha(0.2).toRgbString()
        : tinycolor(semantic.danger.pure).setAlpha(0.2).toRgbString(),
      errorBackground: errorBgColor,
      successBorder: isDark ? semantic.success.pureDark : semantic.success.pure,
      successRing: isDark
        ? tinycolor(semantic.success.pureDark).setAlpha(0.2).toRgbString()
        : tinycolor(semantic.success.pure).setAlpha(0.2).toRgbString(),
      successText: isDark ? semantic.success.textDark : semantic.success.text,
      successBackground: successBgColor,
      iconColor: isDark ? neutral.gray[400] : neutral.gray[500],
      disabledBackground: isDark ? neutral.gray[700] : neutral.gray[100],
      disabledBorder: isDark ? neutral.gray[600] : neutral.gray[300],
      disabledText: isDark ? neutral.gray[500] : neutral.gray[400],
      editingBackground: editingBgColor,
    }
  }

  // Generar fondo de edición para el tema terciario
  const tertiaryEditingBg = isDark
    ? tinycolor(theme.tertiary.bgDark || "#1F2937")
        .setAlpha(0.3)
        .toRgbString()
    : tinycolor(theme.tertiary.bg || "#F3F4F6")
        .setAlpha(0.5)
        .toRgbString()

  // Fondos con degradado sutil para estados especiales
  const errorBgColor = isDark
    ? tinycolor(semantic.danger.bgDark || "#3B1A1A")
        .setAlpha(0.3)
        .toRgbString()
    : tinycolor(semantic.danger.bg || "#FEF2F2")
        .setAlpha(0.5)
        .toRgbString()

  const successBgColor = isDark
    ? tinycolor(semantic.success.bgDark || "#132E1F")
        .setAlpha(0.3)
        .toRgbString()
    : tinycolor(semantic.success.bg || "#F0FDF4")
        .setAlpha(0.5)
        .toRgbString()

  return {
    variants: {
      default: {
        background: isDark ? neutral.gray[800] : neutral.white,
        border: isDark ? neutral.gray[600] : neutral.gray[300],
        text: isDark ? neutral.gray[100] : neutral.gray[900],
        placeholder: isDark ? neutral.gray[500] : neutral.gray[400],
        focusBorder: isDark ? theme.primary.pureDark : theme.primary.pure,
        focusRing: isDark
          ? tinycolor(theme.primary.pureDark).setAlpha(0.2).toRgbString()
          : tinycolor(theme.primary.pure).setAlpha(0.2).toRgbString(),
        hoverBorder: isDark ? neutral.gray[500] : neutral.gray[400],
        errorBorder: isDark ? semantic.danger.pureDark : semantic.danger.pure,
        errorRing: isDark
          ? tinycolor(semantic.danger.pureDark).setAlpha(0.2).toRgbString()
          : tinycolor(semantic.danger.pure).setAlpha(0.2).toRgbString(),
        errorBackground: errorBgColor,
        successBorder: isDark ? semantic.success.pureDark : semantic.success.pure,
        successRing: isDark
          ? tinycolor(semantic.success.pureDark).setAlpha(0.2).toRgbString()
          : tinycolor(semantic.success.pure).setAlpha(0.2).toRgbString(),
        successText: isDark ? semantic.success.textDark : semantic.success.text,
        successBackground: successBgColor,
        iconColor: isDark ? neutral.gray[400] : neutral.gray[500],
        disabledBackground: isDark ? neutral.gray[700] : neutral.gray[100],
        disabledBorder: isDark ? neutral.gray[600] : neutral.gray[300],
        disabledText: isDark ? neutral.gray[500] : neutral.gray[400],
        editingBackground: tertiaryEditingBg,
      },
      primary: generateVariant(theme.primary),
      secondary: generateVariant(theme.secondary),
      tertiary: generateVariant(theme.tertiary),
      accent: generateVariant(semantic.accent),
      neutral: {
        background: isDark ? neutral.gray[800] : neutral.white,
        border: isDark ? neutral.gray[600] : neutral.gray[300],
        text: isDark ? neutral.gray[100] : neutral.gray[900],
        placeholder: isDark ? neutral.gray[500] : neutral.gray[400],
        focusBorder: isDark ? neutral.gray[400] : neutral.gray[600],
        focusRing: isDark
          ? tinycolor(neutral.gray[400]).setAlpha(0.2).toRgbString()
          : tinycolor(neutral.gray[600]).setAlpha(0.2).toRgbString(),
        hoverBorder: isDark ? neutral.gray[500] : neutral.gray[400],
        errorBorder: isDark ? semantic.danger.pureDark : semantic.danger.pure,
        errorRing: isDark
          ? tinycolor(semantic.danger.pureDark).setAlpha(0.2).toRgbString()
          : tinycolor(semantic.danger.pure).setAlpha(0.2).toRgbString(),
        errorBackground: errorBgColor,
        successBorder: isDark ? semantic.success.pureDark : semantic.success.pure,
        successRing: isDark
          ? tinycolor(semantic.success.pureDark).setAlpha(0.2).toRgbString()
          : tinycolor(semantic.success.pure).setAlpha(0.2).toRgbString(),
        successText: isDark ? semantic.success.textDark : semantic.success.text,
        successBackground: successBgColor,
        iconColor: isDark ? neutral.gray[400] : neutral.gray[500],
        disabledBackground: isDark ? neutral.gray[700] : neutral.gray[100],
        disabledBorder: isDark ? neutral.gray[600] : neutral.gray[300],
        disabledText: isDark ? neutral.gray[500] : neutral.gray[400],
        editingBackground: tertiaryEditingBg,
      },
    },
    sizes: {
      sm: {
        height: "h-8",
        fontSize: "text-xs",
        paddingX: "px-2",
        paddingY: "py-1",
        iconSize: "h-2.5 w-2.5",
        iconPadding: "pl-7 pr-2",
      },
      md: {
        height: "h-10",
        fontSize: "text-sm",
        paddingX: "px-3",
        paddingY: "py-2",
        iconSize: "h-3.5 w-3.5",
        iconPadding: "pl-10 pr-3",
      },
      lg: {
        height: "h-12",
        fontSize: "text-base",
        paddingX: "px-4",
        paddingY: "py-2.5",
        iconSize: "h-4 w-4",
        iconPadding: "pl-12 pr-4",
      },
    },
  }
}
