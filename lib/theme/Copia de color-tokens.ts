/**
 * Sistema de tokens de color para Sustrato
 * Este archivo define todos los tokens de color utilizados en la aplicación,
 * organizados por componente y variante.
 */
import colors from "./colors";
import { generateProCardTokens } from "./components/pro-card-tokens";
import { generatePageBackgroundTokens } from "./components/page-background-tokens";
import { generateTextTokens, type TextTokens } from "./components/text-tokens";
import {
  generateDividerTokens,
  type DividerTokens,
} from "./components/divider-tokens";
import {
  generateNavbarTokens,
  type NavbarTokens,
} from "./components/nav-tokens";
import { generateIconTokens, type IconTokens } from "./components/icon-tokens";
import {
  generateInputTokens,
  type InputTokens,
} from "./components/input-tokens";
import {
  generateSelectTokens,
  type SelectTokens,
} from "./components/select-tokens";
import {
  generateButtonTokens,
  type ButtonTokens,
} from "./components/button-tokens";
import {
  generateTableTokens,
  type TableTokens,
} from "./components/table-tokens";

// Tipos base para los tokens de color
export type ColorToken = string;

// Definición de variantes para ProCard
export type ProCardVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accent"
  | "success"
  | "warning"
  | "danger" // Usar siempre "danger", nunca "error"
  | "neutral"
  | "white";

// Tokens para el modo (light/dark)
export type ModeTokens = {
  background: ColorToken;
  foreground: ColorToken;
  muted: ColorToken;
  mutedForeground: ColorToken;
  border: ColorToken;
};

// Tokens para variantes semánticas
export type SemanticTokens = {
  primary: {
    background: ColorToken;
    foreground: ColorToken;
    border: ColorToken;
    gradient: [ColorToken, ColorToken];
    borderGradient: [ColorToken, ColorToken];
  };
  secondary: {
    background: ColorToken;
    foreground: ColorToken;
    border: ColorToken;
    gradient: [ColorToken, ColorToken];
    borderGradient: [ColorToken, ColorToken];
  };
  tertiary: {
    background: ColorToken;
    foreground: ColorToken;
    border: ColorToken;
    gradient: [ColorToken, ColorToken];
    borderGradient: [ColorToken, ColorToken];
  };
  accent: {
    background: ColorToken;
    foreground: ColorToken;
    border: ColorToken;
    gradient: [ColorToken, ColorToken];
    borderGradient: [ColorToken, ColorToken];
  };
  success: {
    background: ColorToken;
    foreground: ColorToken;
    border: ColorToken;
    gradient: [ColorToken, ColorToken];
    borderGradient: [ColorToken, ColorToken];
  };
  warning: {
    background: ColorToken;
    foreground: ColorToken;
    border: ColorToken;
    gradient: [ColorToken, ColorToken];
    borderGradient: [ColorToken, ColorToken];
  };
  danger: {
    background: ColorToken;
    foreground: ColorToken;
    border: ColorToken;
    gradient: [ColorToken, ColorToken];
    borderGradient: [ColorToken, ColorToken];
  };
  neutral: {
    background: ColorToken;
    foreground: ColorToken;
    border: ColorToken;
    gradient: [ColorToken, ColorToken];
    borderGradient: [ColorToken, ColorToken];
  };
  white: {
    background: ColorToken;
    foreground: ColorToken;
    border: ColorToken;
    gradient: [ColorToken, ColorToken];
    borderGradient: [ColorToken, ColorToken];
  };
};

// Tokens específicos para componentes
export type ComponentTokens = {
  // ProCard
  proCard: {
    // Fondos precomputados para cada variante
    backgroundGradient: Record<ProCardVariant, string>;
    // Bordes precomputados para cada variante
    border: Record<ProCardVariant, string>;
    // Gradientes de borde precomputados para cada variante y dirección
    borderGradientTop: Record<ProCardVariant, string>;
    borderGradientLeft: Record<ProCardVariant, string>;
    // Estado seleccionado
    selected: string;
  };

  // Text tokens
  text: TextTokens;

  // ThemeBackground
  themeBackground: {
    background: ColorToken;
    foreground: ColorToken;
  };

  // PageBackground
  pageBackground: {
    default: {
      background: ColorToken;
      backgroundImage: string;
    };
    gradient: {
      background: ColorToken;
      backgroundImage: string;
    };
    subtle: {
      background: ColorToken;
      backgroundImage: string;
    };
    minimal: {
      background: ColorToken;
      backgroundImage: string;
    };
  };

  // Divider tokens
  divider: DividerTokens;

  // Navbar tokens
  navbar: NavbarTokens;

  // Icon tokens
  icon: IconTokens;

  // Input tokens
  input: InputTokens;

  // Select tokens
  select: SelectTokens;

  // Button tokens
  button: ButtonTokens;

  // Table tokens
  table: TableTokens;
};

// Estructura completa de tokens de color
export type ColorTokens = {
  mode: ModeTokens;
  semantic: SemanticTokens;
  component: ComponentTokens;
};

export type ColorScheme = "blue" | "green" | "orange";
export type Mode = "light" | "dark";

/**
 * Función para diluir un color hexadecimal
 * @param hexColor Color hexadecimal (con o sin #)
 * @param opacity Opacidad entre 0 y 1
 * @returns Color RGBA como string
 */
function diluteColor(hexColor: string, opacity = 0.5): string {
  // Asegurarse de que el color comienza con #
  const hex = hexColor.startsWith("#") ? hexColor.substring(1) : hexColor;

  // Convertir a RGB
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // Devolver como rgba
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Genera los tokens de color para el modo (light/dark)
 */
function generateModeTokens(colorScheme: ColorScheme, mode: Mode): ModeTokens {
  const isDark = mode === "dark";
  const themeColors = colors.themes[colorScheme];

  return {
    background: isDark ? colors.neutral.gray[900] : colors.neutral.white,
    foreground: isDark ? colors.neutral.gray[100] : colors.neutral.gray[900],
    muted: isDark ? colors.neutral.gray[800] : colors.neutral.gray[100],
    mutedForeground: isDark
      ? colors.neutral.gray[400]
      : colors.neutral.gray[500],
    border: isDark ? colors.neutral.gray[700] : colors.neutral.gray[200],
  };
}

/**
 * Genera los tokens semánticos basados en el esquema de color y modo
 */
function generateSemanticTokens(
  colorScheme: ColorScheme,
  mode: Mode
): SemanticTokens {
  const isDark = mode === "dark";
  const themeColors = colors.themes[colorScheme];
  const semanticColors = colors.semantic;

  // Función auxiliar para generar tokens básicos para cada variante semántica
  const generateBasicTokens = (color: any) => ({
    background: isDark ? color.bgDark : color.bg,
    foreground: isDark ? color.textDark : color.text,
    border: isDark ? color.pureDark : color.pure,
  });

  // Obtener colores base para cada variante
  const primaryBase = generateBasicTokens(themeColors.primary);
  const secondaryBase = generateBasicTokens(themeColors.secondary);
  const tertiaryBase = generateBasicTokens(themeColors.tertiary);
  const accentBase = generateBasicTokens(semanticColors.accent);
  const successBase = generateBasicTokens(semanticColors.success);
  const warningBase = generateBasicTokens(semanticColors.warning);
  const dangerBase = generateBasicTokens(semanticColors.danger);

  // Colores para gradientes específicos
  const accentColor = isDark
    ? semanticColors.accent.pureDark
    : semanticColors.accent.pure;
  const primaryColor = isDark
    ? themeColors.primary.pureDark
    : themeColors.primary.pure;
  const secondaryColor = isDark
    ? themeColors.secondary.pureDark
    : themeColors.secondary.pure;

  // Diluir los colores de fondo para primary, secondary y tertiary con una opacidad intermedia
  // Usamos 0.35 para modo oscuro y 0.4 para modo claro, que es un punto intermedio entre los valores anteriores
  const dilutedPrimaryBg = diluteColor(
    primaryBase.background,
    isDark ? 0.35 : 0.4
  );
  const dilutedSecondaryBg = diluteColor(
    secondaryBase.background,
    isDark ? 0.35 : 0.4
  );
  const dilutedTertiaryBg = diluteColor(
    tertiaryBase.background,
    isDark ? 0.35 : 0.4
  );

  // Color de fondo para white
  const whiteBg = isDark ? colors.neutral.gray[800] : colors.neutral.white;
  const whiteBgLight = isDark
    ? colors.neutral.gray[900]
    : colors.neutral.gray[50];

  return {
    // Primario, secundario y terciario con fondos diluidos a un nivel intermedio
    primary: {
      ...primaryBase,
      background: dilutedPrimaryBg, // Color de fondo con dilución intermedia
      gradient: [
        dilutedPrimaryBg,
        isDark ? colors.neutral.gray[800] : colors.neutral.white,
      ] as [string, string],
      borderGradient: [primaryColor, accentColor] as [string, string], // Borde: primario hacia accent
    },
    secondary: {
      ...secondaryBase,
      background: dilutedSecondaryBg, // Color de fondo con dilución intermedia
      gradient: [
        dilutedSecondaryBg,
        isDark ? colors.neutral.gray[800] : colors.neutral.white,
      ] as [string, string],
      borderGradient: [secondaryColor, accentColor] as [string, string], // Borde: secundario hacia accent
    },
    tertiary: {
      ...tertiaryBase,
      background: dilutedTertiaryBg, // Color de fondo con dilución intermedia
      gradient: [
        dilutedTertiaryBg,
        isDark ? colors.neutral.gray[800] : colors.neutral.white,
      ] as [string, string],
      borderGradient: [
        isDark ? themeColors.tertiary.pureDark : themeColors.tertiary.pure,
        accentColor,
      ] as [string, string], // Borde: terciario hacia accent
    },

    // Accent (sin cambios)
    accent: {
      ...accentBase,
      gradient: [
        accentBase.background,
        isDark ? colors.neutral.gray[800] : colors.neutral.white,
      ] as [string, string],
      borderGradient: [accentColor, primaryColor] as [string, string], // Borde: accent hacia primario
    },

    // Success, warning, danger (sin cambios)
    success: {
      ...successBase,
      gradient: [
        successBase.background,
        isDark ? colors.neutral.gray[800] : colors.neutral.white,
      ] as [string, string],
      borderGradient: [
        isDark ? semanticColors.success.pureDark : semanticColors.success.pure,
        isDark ? semanticColors.success.textDark : semanticColors.success.text,
      ] as [string, string],
    },
    warning: {
      ...warningBase,
      gradient: [
        warningBase.background,
        isDark ? colors.neutral.gray[800] : colors.neutral.white,
      ] as [string, string],
      borderGradient: [
        isDark ? semanticColors.warning.pureDark : semanticColors.warning.pure,
        isDark ? semanticColors.warning.textDark : semanticColors.warning.text,
      ] as [string, string],
    },
    danger: {
      ...dangerBase,
      gradient: [
        dangerBase.background,
        isDark ? colors.neutral.gray[800] : colors.neutral.white,
      ] as [string, string],
      borderGradient: [
        isDark ? semanticColors.danger.pureDark : semanticColors.danger.pure,
        isDark ? semanticColors.danger.textDark : semanticColors.danger.text,
      ] as [string, string],
    },

    // Neutral (sin cambios)
    neutral: {
      background: isDark ? colors.neutral.gray[800] : colors.neutral.gray[100],
      foreground: isDark ? colors.neutral.gray[200] : colors.neutral.gray[800],
      border: isDark ? colors.neutral.gray[600] : colors.neutral.gray[300],
      gradient: [
        isDark ? colors.neutral.gray[700] : colors.neutral.gray[200],
        isDark ? colors.neutral.gray[900] : colors.neutral.white,
      ] as [string, string], // Gradiente de fondo original
      borderGradient: [
        isDark ? colors.neutral.gray[600] : colors.neutral.gray[300],
        secondaryColor,
      ] as [string, string], // Borde: neutral hacia secundario
    },

    // White
    white: {
      background: whiteBg,
      foreground: isDark ? colors.neutral.gray[200] : colors.neutral.gray[800],
      border: isDark ? colors.neutral.gray[700] : colors.neutral.gray[200],
      gradient: [whiteBg, whiteBgLight] as [string, string],
      borderGradient: [
        isDark ? colors.neutral.gray[700] : colors.neutral.gray[300],
        isDark ? colors.neutral.gray[600] : colors.neutral.gray[400],
      ] as [string, string],
    },
  };
}

/**
 * Genera los tokens específicos para componentes
 */
function generateComponentTokens(
  colorScheme: ColorScheme,
  mode: Mode,
  semanticTokens: SemanticTokens,
  modeTokens: ModeTokens
): ComponentTokens {
  const isDark = mode === "dark";
  const themeColors = colors.themes[colorScheme];

  // Generar tokens para ProCard usando el módulo específico
  const proCardTokens = generateProCardTokens(
    colorScheme,
    mode,
    semanticTokens,
    themeColors
  );

  // Generar tokens de texto usando el nuevo módulo
  const textTokens = generateTextTokens(colorScheme, mode);

  // ThemeBackground tokens
  const themeBackgroundTokens = {
    background: isDark ? colors.neutral.gray[900] : colors.neutral.white,
    foreground: isDark ? colors.neutral.gray[100] : colors.neutral.gray[900],
  };

  // PageBackground tokens
  const pageBackgroundTokens = {
    default: generatePageBackgroundTokens(colorScheme, mode, "default"),
    gradient: generatePageBackgroundTokens(colorScheme, mode, "gradient"),
    subtle: generatePageBackgroundTokens(colorScheme, mode, "subtle"),
    minimal: generatePageBackgroundTokens(colorScheme, mode, "minimal"),
  };

  // Divider tokens
  const dividerTokens = generateDividerTokens(colorScheme, mode);

  // Navbar tokens
  const navbarTokens = generateNavbarTokens(colorScheme, mode);

  // Icon tokens
  const iconTokens = generateIconTokens(colorScheme, mode);

  // Input tokens
  const inputTokens = generateInputTokens(colorScheme, mode);

  // Select tokens
  const selectTokens = generateSelectTokens(colorScheme, mode);

  // Button tokens - asegurarnos de que se generen correctamente
  const buttonTokens = generateButtonTokens(colorScheme, mode);

  // Table tokens
  const tableTokens = generateTableTokens(
    colorScheme,
    mode,
    semanticTokens,
    modeTokens
  );

  return {
    input: inputTokens,
    proCard: proCardTokens,
    text: textTokens,
    themeBackground: themeBackgroundTokens,
    pageBackground: pageBackgroundTokens,
    divider: dividerTokens,
    navbar: navbarTokens,
    icon: iconTokens,
    select: selectTokens,
    button: buttonTokens,
    table: tableTokens,
  };
}

/**
 * Crea todos los tokens de color basados en el esquema de color y modo
 */
export function createColorTokens(
  colorScheme: ColorScheme,
  mode: Mode
): ColorTokens {
  const modeTokens = generateModeTokens(colorScheme, mode);
  const semanticTokens = generateSemanticTokens(colorScheme, mode);
  const componentTokens = generateComponentTokens(
    colorScheme,
    mode,
    semanticTokens,
    modeTokens
  );

  return {
    mode: modeTokens,
    semantic: semanticTokens,
    component: componentTokens,
  };
}

// Exportamos un objeto vacío como placeholder inicial
// Este será reemplazado por el ThemeProvider en tiempo de ejecución
export let colorTokens: ColorTokens = {} as ColorTokens;

// Función para actualizar los tokens de color globalmente
export function updateColorTokens(tokens: ColorTokens): void {
  colorTokens = tokens;
}
