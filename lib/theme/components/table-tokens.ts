import tinycolor from "tinycolor2";
import type { ColorScheme, Mode } from "../color-tokens";
import type {
  SemanticTokens,
  ModeTokens,
  ProCardVariant,
} from "../color-tokens"; // Asegúrate que estos tipos estén exportados de color-tokens.ts
import baseColors from "../colors"; // Para acceder a los colores base directamente si es necesario

// Extender ProCardVariant para incluir todos los casos semánticos y 'white'
export type CellVariant = ProCardVariant; // success, warning, danger, primary, secondary, tertiary, accent, neutral, white

export interface TableTokens {
  container: {
    backgroundColor: string;
    borderColor: string;
  };
  header: {
    backgroundColor: string;
    foregroundColor: string;
    borderColor: string;
    sortIconColor: string;
    sortIconHoverColor: string; // Para el hover del icono de ordenamiento
    resizeHandleColor: string;
  };
  row: {
    default: {
      backgroundColor: string;
      foregroundColor: string;
      borderColor: string;
      hoverBackgroundColor: string;
    };
    status: {
      success: {
        backgroundColor: string;
        foregroundColor: string;
        hoverBackgroundColor: string;
      };
      warning: {
        backgroundColor: string;
        foregroundColor: string;
        hoverBackgroundColor: string;
      };
      danger: {
        backgroundColor: string;
        foregroundColor: string;
        hoverBackgroundColor: string;
      };
      info: {
        backgroundColor: string;
        foregroundColor: string;
        hoverBackgroundColor: string;
      };
      neutral: {
        backgroundColor: string;
        foregroundColor: string;
        hoverBackgroundColor: string;
      };
    };
    subRowBackgroundColor: string; // Para el fondo de la fila contenedora de subfilas
    subRowIndentBorderColor: string; // Para el borde izquierdo de la indentación de subfilas
  };
  cell: {
    borderColor: string;
    foregroundColor: string; // Color de texto general para celdas sin variante de fondo
    // Nuevos tokens para variantes de celda
    variants: Record<
      CellVariant,
      {
        backgroundColor: string;
        foregroundColor: string;
        hoverBackgroundColor: string; // Para cuando la fila está en hover
      }
    >;
  };
  toolbar: {
    columnSelector: {
      backgroundColor: string;
      foregroundColor: string;
    };
  };
  tooltip: {
    // Aunque ya se refactorizó, centralicemos los tokens
    backgroundColor: string;
    foregroundColor: string; // Color de texto del tooltip
    borderColor: string;
    borderColorLongContent: string;
  };
}

export function generateTableTokens(
  colorScheme: ColorScheme,
  mode: Mode,
  semantic: SemanticTokens,
  modeColors: ModeTokens
): TableTokens {
  const isDark = mode === "dark";

  // --- Helper para generar colores de variante (para celdas y potencialmente otros usos) ---
  const generateVariantColors = (variant: CellVariant) => {
    const semanticVariant = semantic[variant as keyof SemanticTokens]; // Asegurar que 'variant' sea un key válido de SemanticTokens
    let baseColorObj: {
      background: string;
      foreground: string;
      border?: string;
    };

    if (semanticVariant) {
      baseColorObj = {
        background: semanticVariant.background,
        foreground: semanticVariant.foreground,
      };
    } else if (variant === "white") {
      baseColorObj = {
        background: isDark
          ? baseColors.neutral.gray[800]
          : baseColors.neutral.white, // Tomado de semantic.white en color-tokens
        foreground: isDark
          ? baseColors.neutral.gray[200]
          : baseColors.neutral.gray[800],
      };
    } else {
      // Fallback para variantes no encontradas directamente en semantic (ej. primary, secondary, tertiary del tema)
      // Esto requiere que semanticTokens tenga estas variantes o ajustar la lógica.
      // Por ahora, usaremos un color de fallback o el de 'neutral' si no se encuentra.
      const themeVariantKey = variant as keyof typeof semantic; // Esto puede no ser siempre correcto, ajustar si es necesario
      const themeColor = semantic[themeVariantKey] || semantic.neutral;
      baseColorObj = {
        background: themeColor.background,
        foreground: themeColor.foreground,
      };
    }

    return {
      backgroundColor: baseColorObj.background,
      foregroundColor: baseColorObj.foreground,
      hoverBackgroundColor: tinycolor(baseColorObj.background)
        .darken(isDark ? 3 : 2) // Oscurecer un poco en hover, ajustar valores según necesidad
        .lighten(isDark ? 0 : 3)
        .toRgbString(),
    };
  };

  const cellVariantTokens = {} as Record<
    CellVariant,
    {
      backgroundColor: string;
      foregroundColor: string;
      hoverBackgroundColor: string;
    }
  >;
  const allCellVariants: CellVariant[] = [
    "primary",
    "secondary",
    "tertiary",
    "accent",
    "success",
    "warning",
    "danger",
    "neutral",
    "white",
  ];
  allCellVariants.forEach((variant) => {
    cellVariantTokens[variant] = generateVariantColors(variant);
  });

  // --- Conteneder de la tabla ---
  const containerBackgroundColor = modeColors.background;
  const containerBorderColor = modeColors.border;

  // --- Encabezado ---
  const headerBackgroundColor = tinycolor(semantic.accent.background)
    .setAlpha(isDark ? 0.15 : 0.08)
    .toRgbString(); // Más sutil que bg-accent/5
  const headerForegroundColor = modeColors.foreground;
  const headerBorderColor = modeColors.border;
  const sortIconColor = tinycolor(modeColors.mutedForeground)
    .setAlpha(0.7)
    .toRgbString();
  const sortIconHoverColor = semantic.primary.foreground;
  const resizeHandleColor = tinycolor(semantic.primary.background)
    .setAlpha(0.3)
    .toRgbString();

  // --- Filas ---
  const rowDefaultBackgroundColor = modeColors.background;
  const rowDefaultForegroundColor = modeColors.foreground;
  const rowDefaultBorderColor = tinycolor(modeColors.border)
    .setAlpha(0.5)
    .toRgbString();
  const rowDefaultHoverBackgroundColor = tinycolor(modeColors.muted)
    .setAlpha(isDark ? 0.3 : 0.5)
    .toRgbString();

  const generateRowStatusColors = (statusKey: CellVariant) => {
    // Cambiado a CellVariant para reutilizar
    const variantInfo = generateVariantColors(statusKey); // Usar el helper general
    return {
      backgroundColor: variantInfo.backgroundColor,
      foregroundColor: variantInfo.foregroundColor,
      hoverBackgroundColor: variantInfo.hoverBackgroundColor, // Ya tiene la lógica de hover
    };
  };

  const rowStatusColors = {
    success: generateRowStatusColors("success"),
    warning: generateRowStatusColors("warning"),
    danger: generateRowStatusColors("danger"),
    info: generateRowStatusColors("accent"),
    neutral: generateRowStatusColors("neutral"),
  };

  const subRowBackgroundColor = tinycolor(modeColors.muted)
    .setAlpha(isDark ? 0.2 : 0.3)
    .toRgbString();
  const subRowIndentBorderColor = tinycolor(semantic.primary.background)
    .setAlpha(0.3)
    .toRgbString();

  // --- Celdas ---
  const cellBorderColor = tinycolor(modeColors.border)
    .setAlpha(0.7)
    .toRgbString();
  const cellForegroundColor = modeColors.foreground; // Color por defecto si no hay variante de celda

  // --- Toolbar ---
  const columnSelectorBackgroundColor = modeColors.muted;
  const columnSelectorForegroundColor = modeColors.foreground;

  // --- Tooltip ---
  const tooltipBackgroundColor = modeColors.background;
  const tooltipForegroundColor = modeColors.foreground;
  const tooltipBorderColor = modeColors.border;
  const tooltipBorderColorLongContent = semantic.accent.border;

  return {
    container: {
      backgroundColor: containerBackgroundColor,
      borderColor: containerBorderColor,
    },
    header: {
      backgroundColor: headerBackgroundColor,
      foregroundColor: headerForegroundColor,
      borderColor: headerBorderColor,
      sortIconColor: sortIconColor,
      sortIconHoverColor: sortIconHoverColor,
      resizeHandleColor: resizeHandleColor,
    },
    row: {
      default: {
        backgroundColor: rowDefaultBackgroundColor,
        foregroundColor: rowDefaultForegroundColor,
        borderColor: rowDefaultBorderColor,
        hoverBackgroundColor: rowDefaultHoverBackgroundColor,
      },
      status: rowStatusColors,
      subRowBackgroundColor: subRowBackgroundColor,
      subRowIndentBorderColor: subRowIndentBorderColor,
    },
    cell: {
      borderColor: cellBorderColor,
      foregroundColor: cellForegroundColor,
      variants: cellVariantTokens, // Añadido
    },
    toolbar: {
      columnSelector: {
        backgroundColor: columnSelectorBackgroundColor,
        foregroundColor: columnSelectorForegroundColor,
      },
    },
    tooltip: {
      backgroundColor: tooltipBackgroundColor,
      foregroundColor: tooltipForegroundColor,
      borderColor: tooltipBorderColor,
      borderColorLongContent: tooltipBorderColorLongContent,
    },
  };
}
