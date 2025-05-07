import type { ColorScheme, Mode } from "../color-tokens"
import colors from "../colors"

export type DividerVariant = "gradient" | "solid" | "subtle"
export type DividerSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface DividerTokens {
  // Variantes de divider
  variants: {
    gradient: {
      backgroundImage: string
    }
    solid: {
      background: string
    }
    subtle: {
      background: string
    }
  }
  // Tamaños predefinidos
  sizes: {
    xs: {
      height: string
      width: string
      borderRadius: string
    }
    sm: {
      height: string
      width: string
      borderRadius: string
    }
    md: {
      height: string
      width: string
      borderRadius: string
    }
    lg: {
      height: string
      width: string
      borderRadius: string
    }
    xl: {
      height: string
      width: string
      borderRadius: string
    }
  }
}

/**
 * Genera los tokens para el componente Divider
 */
export function generateDividerTokens(colorScheme: ColorScheme, mode: Mode): DividerTokens {
  const isDark = mode === "dark"
  const themeColors = colors.themes[colorScheme]

  // Colores para el gradiente
  const primaryColor = isDark ? themeColors.primary.pureDark : themeColors.primary.pure
  const accentColor = isDark ? colors.semantic.accent.pureDark : colors.semantic.accent.pure
  const secondaryColor = isDark ? themeColors.secondary.pureDark : themeColors.secondary.pure

  // Colores para variantes sólidas y sutiles
  const solidColor = isDark ? themeColors.primary.pureDark : themeColors.primary.pure
  const subtleColor = isDark
    ? `rgba(${Number.parseInt(themeColors.primary.pureDark.slice(1, 3), 16)}, ${Number.parseInt(themeColors.primary.pureDark.slice(3, 5), 16)}, ${Number.parseInt(themeColors.primary.pureDark.slice(5, 7), 16)}, 0.3)`
    : `rgba(${Number.parseInt(themeColors.primary.pure.slice(1, 3), 16)}, ${Number.parseInt(themeColors.primary.pure.slice(3, 5), 16)}, ${Number.parseInt(themeColors.primary.pure.slice(5, 7), 16)}, 0.3)`

  return {
    variants: {
      gradient: {
        backgroundImage: `linear-gradient(to right, ${primaryColor}, ${accentColor}, ${secondaryColor})`,
      },
      solid: {
        background: solidColor,
      },
      subtle: {
        background: subtleColor,
      },
    },
    sizes: {
      xs: {
        height: "2px",
        width: "60px",
        borderRadius: "1px",
      },
      sm: {
        height: "2px",
        width: "100px",
        borderRadius: "1px",
      },
      md: {
        height: "3px",
        width: "150px",
        borderRadius: "1.5px",
      },
      lg: {
        height: "4px",
        width: "200px",
        borderRadius: "2px",
      },
      xl: {
        height: "5px",
        width: "250px",
        borderRadius: "2.5px",
      },
    },
  }
}
