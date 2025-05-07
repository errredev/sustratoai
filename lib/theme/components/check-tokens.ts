import { colors } from "@/lib/theme/colors"

export type CheckVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
export type CheckSize = "xs" | "sm" | "md" | "lg" | "xl"
export type CheckVisualVariant = "default" | "outline" | "subtle" | "solid"

interface CheckTokens {
  // Colores base
  background: string
  border: string
  check: string
  text: string

  // Estados
  hover: {
    background: string
    border: string
  }
  focus: {
    outline: string
  }
  active: {
    background: string
    border: string
  }
  checked: {
    background: string
    border: string
    check: string
  }
  disabled: {
    background: string
    border: string
    check: string
    text: string
    opacity: number
  }

  // Tamaños
  size: {
    box: string
    checkThickness: number
    borderRadius: string
    fontSize: string
    padding: string
  }
}

export function generateCheckTokens(
  colorScheme: string,
  mode: "light" | "dark",
  size: CheckSize = "md",
  variant: CheckVariant = "primary",
  visualVariant: CheckVisualVariant = "default",
): CheckTokens {
  // Obtener colores del tema
  const themeColors = colors.themes[colorScheme] || colors.themes.blue
  const semanticColors = colors.semantic
  const neutralColors = colors.neutral
  const isDark = mode === "dark"

  // Determinar tamaños
  const sizeTokens = getSizeTokens(size)

  // Generar tokens según la variante
  if (variant === "neutral") {
    return generateNeutralTokens(neutralColors, isDark, visualVariant, sizeTokens)
  } else {
    return generateColorTokens(
      getColorForVariant(variant, themeColors, semanticColors),
      isDark,
      visualVariant,
      sizeTokens,
      neutralColors,
      themeColors,
      variant,
    )
  }
}

// Función para obtener el color base según la variante
function getColorForVariant(variant: CheckVariant, themeColors: any, semanticColors: any) {
  switch (variant) {
    case "primary":
      return themeColors.primary
    case "secondary":
      return themeColors.secondary
    case "tertiary":
      return themeColors.tertiary
    case "accent":
      return themeColors.accent
    case "success":
      return semanticColors.success
    case "warning":
      return semanticColors.warning
    case "danger":
      return semanticColors.danger
    default:
      return themeColors.primary // Fallback seguro
  }
}

// Función para obtener tokens de tamaño
function getSizeTokens(size: CheckSize) {
  switch (size) {
    case "xs":
      return {
        box: "16px",
        checkThickness: 2.5,
        borderRadius: "3px",
        fontSize: "0.75rem",
        padding: "0.25rem",
      }
    case "sm":
      return {
        box: "18px",
        checkThickness: 3,
        borderRadius: "4px",
        fontSize: "0.875rem",
        padding: "0.375rem",
      }
    case "lg":
      return {
        box: "24px",
        checkThickness: 4,
        borderRadius: "6px",
        fontSize: "1.125rem",
        padding: "0.625rem",
      }
    case "xl":
      return {
        box: "28px",
        checkThickness: 5,
        borderRadius: "7px",
        fontSize: "1.25rem",
        padding: "0.75rem",
      }
    default: // md
      return {
        box: "20px",
        checkThickness: 3.5,
        borderRadius: "5px",
        fontSize: "1rem",
        padding: "0.5rem",
      }
  }
}

// Función para generar tokens para la variante neutral
function generateNeutralTokens(
  neutralColors: any,
  isDark: boolean,
  visualVariant: CheckVisualVariant,
  sizeTokens: any,
): CheckTokens {
  // Colores para la variante neutral
  let background: string
  let border: string
  let check: string
  let checkedBackground: string
  let checkedBorder: string

  // Usar colores más contrastantes para el check
  const checkColor = isDark ? neutralColors.gray[50] : neutralColors.gray[900]

  switch (visualVariant) {
    case "outline":
      background = "transparent"
      border = isDark ? neutralColors.gray[400] : neutralColors.gray[500]
      check = checkColor
      checkedBackground = "transparent"
      checkedBorder = isDark ? neutralColors.gray[300] : neutralColors.gray[600]
      break
    case "subtle":
      background = isDark ? `${neutralColors.gray[700]}40` : `${neutralColors.gray[300]}40`
      border = isDark ? neutralColors.gray[600] : neutralColors.gray[400]
      check = checkColor
      checkedBackground = isDark ? `${neutralColors.gray[600]}80` : `${neutralColors.gray[400]}80`
      checkedBorder = isDark ? neutralColors.gray[500] : neutralColors.gray[500]
      break
    case "solid":
      background = isDark ? neutralColors.gray[700] : neutralColors.gray[300]
      border = isDark ? neutralColors.gray[600] : neutralColors.gray[400]
      check = checkColor
      checkedBackground = isDark ? neutralColors.gray[600] : neutralColors.gray[400]
      checkedBorder = isDark ? neutralColors.gray[500] : neutralColors.gray[500]
      break
    default: // default
      // Fondo blanco para default en modo claro, y un gris oscuro en modo oscuro
      background = isDark ? neutralColors.gray[800] : "#ffffff"
      border = isDark ? neutralColors.gray[500] : neutralColors.gray[400]
      check = checkColor
      checkedBackground = isDark ? neutralColors.gray[700] : "#ffffff"
      checkedBorder = isDark ? neutralColors.gray[400] : neutralColors.gray[500]
      break
  }

  // Hover, focus y active para neutral
  const hoverBackground = isDark ? `${neutralColors.gray[600]}40` : `${neutralColors.gray[400]}40`
  const hoverBorder = isDark ? neutralColors.gray[400] : neutralColors.gray[500]
  const focusOutline = isDark ? `${neutralColors.gray[400]}60` : `${neutralColors.gray[500]}60`
  const activeBackground = isDark ? `${neutralColors.gray[600]}60` : `${neutralColors.gray[400]}60`
  const activeBorder = isDark ? neutralColors.gray[300] : neutralColors.gray[600]

  return {
    background,
    border,
    check: isDark ? "#ffffff" : "#000000",
    text: isDark ? neutralColors.gray[100] : neutralColors.gray[900],

    hover: {
      background: hoverBackground,
      border: hoverBorder,
    },

    focus: {
      outline: focusOutline,
    },

    active: {
      background: activeBackground,
      border: activeBorder,
    },

    checked: {
      background: checkedBackground,
      border: checkedBorder,
      check: visualVariant === "solid" ? (isDark ? "#ffffff" : "#000000") : check,
    },

    disabled: {
      background: isDark ? `${neutralColors.gray[800]}80` : `${neutralColors.gray[200]}80`,
      border: isDark ? `${neutralColors.gray[700]}80` : `${neutralColors.gray[300]}80`,
      check: isDark ? `${neutralColors.gray[500]}80` : `${neutralColors.gray[500]}80`,
      text: isDark ? `${neutralColors.gray[500]}80` : `${neutralColors.gray[500]}80`,
      opacity: 0.6,
    },

    size: sizeTokens,
  }
}

// Función para generar tokens para variantes de color
function generateColorTokens(
  baseColor: any,
  isDark: boolean,
  visualVariant: CheckVisualVariant,
  sizeTokens: any,
  neutralColors: any,
  themeColors: any,
  variant: CheckVariant,
): CheckTokens {
  // Verificar que baseColor tenga las propiedades necesarias
  if (!baseColor || !baseColor.pure) {
    // Fallback seguro si baseColor no tiene las propiedades esperadas
    return generateNeutralTokens(neutralColors, isDark, visualVariant, sizeTokens)
  }

  // Colores para las variantes de color
  let background: string
  let border: string
  let check: string
  let checkedBackground: string
  let checkedBorder: string

  // Para la variante default, usamos el color secondary para el check si estamos en primary
  const useSecondaryCheck =
    visualVariant === "default" && variant === "primary" && themeColors.secondary && themeColors.secondary.pure

  // Determinar el color del check
  const checkColor = useSecondaryCheck
    ? themeColors.secondary.pure
    : isDark
      ? "#ffffff"
      : baseColor.dark || baseColor.pure

  switch (visualVariant) {
    case "outline":
      background = "transparent"
      border = baseColor.pure
      check = checkColor
      checkedBackground = "transparent"
      checkedBorder = baseColor.pure
      break
    case "subtle":
      background = `${baseColor.pure}20`
      border = `${baseColor.pure}60`
      check = checkColor
      checkedBackground = `${baseColor.pure}40`
      checkedBorder = baseColor.pure
      break
    case "solid":
      background = baseColor.light || `${baseColor.pure}40`
      border = baseColor.pure
      check = isDark ? "#ffffff" : useSecondaryCheck ? themeColors.secondary.pure : "#000000"
      checkedBackground = baseColor.pure
      checkedBorder = baseColor.pure
      break
    default: // default
      // Fondo blanco para default en modo claro, y un gris oscuro en modo oscuro
      background = isDark ? neutralColors.gray[800] : "#ffffff"
      border = isDark ? baseColor.light || `${baseColor.pure}40` : baseColor.pure
      check = checkColor
      checkedBackground = isDark ? neutralColors.gray[800] : "#ffffff"
      checkedBorder = baseColor.pure
      break
  }

  return {
    background,
    border,
    check: isDark ? "#ffffff" : "#000000",
    text: isDark ? neutralColors.gray[100] : neutralColors.gray[900],

    hover: {
      background: `${baseColor.pure}20`,
      border: baseColor.pure,
    },

    focus: {
      outline: `${baseColor.pure}60`,
    },

    active: {
      background: `${baseColor.pure}30`,
      border: baseColor.dark || baseColor.pure,
    },

    checked: {
      background: checkedBackground,
      border: checkedBorder,
      check:
        visualVariant === "solid"
          ? isDark
            ? "#ffffff"
            : useSecondaryCheck
              ? themeColors.secondary.pure
              : "#000000"
          : check,
    },

    disabled: {
      background: isDark ? `${neutralColors.gray[800]}80` : `${neutralColors.gray[200]}80`,
      border: isDark ? `${neutralColors.gray[700]}80` : `${neutralColors.gray[300]}80`,
      check: isDark ? `${neutralColors.gray[500]}80` : `${neutralColors.gray[500]}80`,
      text: isDark ? `${neutralColors.gray[500]}80` : `${neutralColors.gray[500]}80`,
      opacity: 0.6,
    },

    size: sizeTokens,
  }
}
