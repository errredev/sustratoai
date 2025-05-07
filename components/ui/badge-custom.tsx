"use client"

import type React from "react"
import { Text } from "./text"
import { cn } from "@/lib/utils"
import { useTheme } from "@/app/theme-provider"
import { generateBadgeTokens } from "@/lib/theme/components/badge-tokens"
import type { BadgeVariant } from "@/lib/theme/components/badge-tokens"
import { colors, semantic } from "@/lib/theme/colors"

export interface BadgeCustomProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
  bordered?: boolean
  children: React.ReactNode
}

export function BadgeCustom({
  variant = "neutral",
  bordered = false,
  children,
  className,
  ...props
}: BadgeCustomProps) {
  const { colorScheme, mode } = useTheme()
  const badgeTokens = generateBadgeTokens(colorScheme, mode)
  const tokens = badgeTokens[variant]
  const isDark = mode === "dark"
  const themeColors = colors.themes[colorScheme]

  // Determinar el color del borde basado en la variante
  let borderColor: string

  switch (variant) {
    case "success":
      borderColor = isDark ? semantic.success.pureDark : semantic.success.pure
      break
    case "warning":
      borderColor = isDark ? semantic.warning.pureDark : semantic.warning.pure
      break
    case "danger":
      borderColor = isDark ? semantic.danger.pureDark : semantic.danger.pure
      break
    case "accent":
      borderColor = isDark ? semantic.accent.pureDark : semantic.accent.pure
      break
    case "neutral":
      borderColor = isDark ? colors.neutral.gray[600] : colors.neutral.gray[400]
      break
    default:
      // Para primary, secondary, tertiary usar los colores del tema
      borderColor = isDark
        ? themeColors[variant]?.pureDark || themeColors.primary.pureDark
        : themeColors[variant]?.pure || themeColors.primary.pure
  }

  return (
    <div
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5", className)}
      style={{
        backgroundColor: tokens.background,
        ...(bordered && {
          border: "1px solid",
          borderColor: borderColor,
        }),
      }}
      {...props}
    >
      <Text
        size="xs"
        weight="medium"
        fontType="body"
        color={tokens.textColor as any}
        colorVariant={tokens.textColorVariant as any}
      >
        {children}
      </Text>
    </div>
  )
}
