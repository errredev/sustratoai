import { colors, semantic } from "@/lib/theme/colors"
import type { ColorScheme, Mode } from "@/lib/theme/color-tokens"

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "neutral"

export interface BadgeTokens {
  background: string
  textColor: string
  textColorVariant: string
}

export function generateBadgeTokens(colorScheme: ColorScheme, mode: Mode) {
  const isDark = mode === "dark"
  const themeColors = colors.themes[colorScheme]

  return {
    primary: {
      background: isDark ? themeColors.primary.bgDark : themeColors.primary.bg,
      textColor: "primary",
      textColorVariant: isDark ? "textDark" : "text",
    },
    secondary: {
      background: isDark ? themeColors.secondary.bgDark : themeColors.secondary.bg,
      textColor: "secondary",
      textColorVariant: isDark ? "textDark" : "text",
    },
    tertiary: {
      background: isDark ? themeColors.tertiary.bgDark : themeColors.tertiary.bg,
      textColor: "tertiary",
      textColorVariant: isDark ? "textDark" : "text",
    },
    accent: {
      background: isDark ? semantic.accent.bgDark : semantic.accent.bg,
      textColor: "accent",
      textColorVariant: isDark ? "textDark" : "text",
    },
    success: {
      background: isDark ? semantic.success.bgDark : semantic.success.bg,
      textColor: "success",
      textColorVariant: isDark ? "textDark" : "text",
    },
    warning: {
      background: isDark ? semantic.warning.bgDark : semantic.warning.bg,
      textColor: "warning",
      textColorVariant: isDark ? "textDark" : "text",
    },
    danger: {
      background: isDark ? semantic.danger.bgDark : semantic.danger.bg,
      textColor: "danger",
      textColorVariant: isDark ? "textDark" : "text",
    },
    neutral: {
      background: isDark ? colors.neutral.gray[800] : colors.neutral.gray[200],
      textColor: "neutral",
      textColorVariant: isDark ? "white" : "black",
    },
  }
}
