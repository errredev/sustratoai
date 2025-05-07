import type { ProCardVariant } from "../color-tokens"
import type { ColorScheme, Mode } from "../color-tokens"

/**
 * Genera los tokens de fondo para ProCard
 */
export function generateProCardBackgroundGradients(
  semanticTokens: any,
  isDark: boolean,
): Record<ProCardVariant, string> {
  return {
    primary: `linear-gradient(135deg, ${semanticTokens.primary.gradient[0]} 0%, ${semanticTokens.primary.gradient[1]} 100%)`,
    secondary: `linear-gradient(135deg, ${semanticTokens.secondary.gradient[0]} 0%, ${semanticTokens.secondary.gradient[1]} 100%)`,
    tertiary: `linear-gradient(135deg, ${semanticTokens.tertiary.gradient[0]} 0%, ${semanticTokens.tertiary.gradient[1]} 100%)`,
    accent: `linear-gradient(135deg, ${semanticTokens.accent.gradient[0]} 0%, ${semanticTokens.accent.gradient[1]} 100%)`,
    success: `linear-gradient(135deg, ${semanticTokens.success.gradient[0]} 0%, ${semanticTokens.success.gradient[1]} 100%)`,
    warning: `linear-gradient(135deg, ${semanticTokens.warning.gradient[0]} 0%, ${semanticTokens.warning.gradient[1]} 100%)`,
    danger: `linear-gradient(135deg, ${semanticTokens.danger.gradient[0]} 0%, ${semanticTokens.danger.gradient[1]} 100%)`,
    neutral: `linear-gradient(135deg, ${semanticTokens.neutral.gradient[0]} 0%, ${semanticTokens.neutral.gradient[1]} 100%)`,
    white: `linear-gradient(135deg, ${semanticTokens.white.gradient[0]} 0%, ${semanticTokens.white.gradient[1]} 100%)`,
  }
}

/**
 * Genera los tokens de borde para ProCard
 */
export function generateProCardBorders(semanticTokens: any): Record<ProCardVariant, string> {
  return {
    primary: semanticTokens.primary.border,
    secondary: semanticTokens.secondary.border,
    tertiary: semanticTokens.tertiary.border,
    accent: semanticTokens.accent.border,
    success: semanticTokens.success.border,
    warning: semanticTokens.warning.border,
    danger: semanticTokens.danger.border,
    neutral: semanticTokens.neutral.border,
    white: semanticTokens.white.border,
  }
}

/**
 * Genera los tokens de gradiente de borde superior para ProCard
 */
export function generateProCardBorderGradientsTop(semanticTokens: any): Record<ProCardVariant, string> {
  return {
    primary: `linear-gradient(90deg, ${semanticTokens.primary.borderGradient[0]} 0%, ${semanticTokens.primary.borderGradient[1]} 100%)`,
    secondary: `linear-gradient(90deg, ${semanticTokens.secondary.borderGradient[0]} 0%, ${semanticTokens.secondary.borderGradient[1]} 100%)`,
    tertiary: `linear-gradient(90deg, ${semanticTokens.tertiary.borderGradient[0]} 0%, ${semanticTokens.tertiary.borderGradient[1]} 100%)`,
    accent: `linear-gradient(90deg, ${semanticTokens.accent.borderGradient[0]} 0%, ${semanticTokens.accent.borderGradient[1]} 100%)`,
    success: `linear-gradient(90deg, ${semanticTokens.success.borderGradient[0]} 0%, ${semanticTokens.success.borderGradient[1]} 100%)`,
    warning: `linear-gradient(90deg, ${semanticTokens.warning.borderGradient[0]} 0%, ${semanticTokens.warning.borderGradient[1]} 100%)`,
    danger: `linear-gradient(90deg, ${semanticTokens.danger.borderGradient[0]} 0%, ${semanticTokens.danger.borderGradient[1]} 100%)`,
    neutral: `linear-gradient(90deg, ${semanticTokens.neutral.borderGradient[0]} 0%, ${semanticTokens.neutral.borderGradient[1]} 100%)`,
    white: `linear-gradient(90deg, ${semanticTokens.white.borderGradient[0]} 0%, ${semanticTokens.white.borderGradient[1]} 100%)`,
  }
}

/**
 * Genera los tokens de gradiente de borde izquierdo para ProCard
 */
export function generateProCardBorderGradientsLeft(semanticTokens: any): Record<ProCardVariant, string> {
  return {
    primary: `linear-gradient(180deg, ${semanticTokens.primary.borderGradient[0]} 0%, ${semanticTokens.primary.borderGradient[1]} 100%)`,
    secondary: `linear-gradient(180deg, ${semanticTokens.secondary.borderGradient[0]} 0%, ${semanticTokens.secondary.borderGradient[1]} 100%)`,
    tertiary: `linear-gradient(180deg, ${semanticTokens.tertiary.borderGradient[0]} 0%, ${semanticTokens.tertiary.borderGradient[1]} 100%)`,
    accent: `linear-gradient(180deg, ${semanticTokens.accent.borderGradient[0]} 0%, ${semanticTokens.accent.borderGradient[1]} 100%)`,
    success: `linear-gradient(180deg, ${semanticTokens.success.borderGradient[0]} 0%, ${semanticTokens.success.borderGradient[1]} 100%)`,
    warning: `linear-gradient(180deg, ${semanticTokens.warning.borderGradient[0]} 0%, ${semanticTokens.warning.borderGradient[1]} 100%)`,
    danger: `linear-gradient(180deg, ${semanticTokens.danger.borderGradient[0]} 0%, ${semanticTokens.danger.borderGradient[1]} 100%)`,
    neutral: `linear-gradient(180deg, ${semanticTokens.neutral.borderGradient[0]} 0%, ${semanticTokens.neutral.borderGradient[1]} 100%)`,
    white: `linear-gradient(180deg, ${semanticTokens.white.borderGradient[0]} 0%, ${semanticTokens.white.borderGradient[1]} 100%)`,
  }
}

/**
 * Genera todos los tokens para ProCard
 */
export function generateProCardTokens(colorScheme: ColorScheme, mode: Mode, semanticTokens: any, themeColors: any) {
  const isDark = mode === "dark"

  return {
    backgroundGradient: generateProCardBackgroundGradients(semanticTokens, isDark),
    border: generateProCardBorders(semanticTokens),
    borderGradientTop: generateProCardBorderGradientsTop(semanticTokens),
    borderGradientLeft: generateProCardBorderGradientsLeft(semanticTokens),
    selected: isDark ? themeColors.primary.pureDark : themeColors.primary.pure,
  }
}
