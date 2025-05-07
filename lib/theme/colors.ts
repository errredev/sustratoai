/**
 * Sistema de colores para Sustrato
 * Este archivo sirve como fuente única de verdad para todos los colores utilizados en la aplicación.
 */

// Tipos para mejor autocompletado y seguridad de tipos
type ColorShade = {
  pure: string;
  pureDark: string;
  text: string;
  textDark: string;
  bg: string;
  bgDark: string;
};

type ThemeColors = {
  primary: ColorShade;
  secondary: ColorShade;
  tertiary: ColorShade;
};

type SemanticColors = {
  accent: ColorShade;
  success: ColorShade;
  warning: ColorShade;
  danger: ColorShade;
};

// Temas de colores
export const themes = {
  blue: {
    primary: {
      pure: "#3D7DF6",
      pureDark: "#2E5EB9",
      text: "#1f4487",
      textDark: "#132951",
      bg: "#DDE5FA",
      bgDark: "#A6ACBC",
    },
    secondary: {
      pure: "#516e99",
      pureDark: "#3D5373",
      text: "#364866",
      textDark: "#202B3D",
      bg: "#D2E1FF",
      bgDark: "#A0B0CC", // Estimado, no proporcionado
    },
    tertiary: {
      pure: "#1EA4E9",
      pureDark: "#177BAF",
      text: "#115f87",
      textDark: "#0A3951",
      bg: "#c7eafc",
      bgDark: "#95B0BD",
    },
  } as ThemeColors,

  green: {
    primary: {
      pure: "#24BC81",
      pureDark: "#1c8e63",
      text: "#125E41",
      textDark: "#0b3726",
      bg: "#c0f7e2",
      bgDark: "#91bdac",
    },
    secondary: {
      pure: "#4F7F10",
      pureDark: "#3B5F0C",
      text: "#2C4709",
      textDark: "#213507",
      bg: "#DBE1CE",
      bgDark: "#A8B89A",
    },
    tertiary: {
      pure: "#3AD7BF",
      pureDark: "#2CA18F",
      text: "#1E7064",
      textDark: "#16544B",
      bg: "#d7faf5",
      bgDark: "#A1BBB8",
    },
  } as ThemeColors,

  orange: {
    primary: {
      pure: "#F77019",
      pureDark: "#B95413",
      text: "#99450f",
      textDark: "#5C2909",
      bg: "#FAECE3",
      bgDark: "#BCB1AA",
    },
    secondary: {
      pure: "#913E0F",
      pureDark: "#6D2F0B",
      text: "#5e2909",
      textDark: "#381905",
      bg: "#E1D1C6",
      bgDark: "#A99D95",
    },
    tertiary: {
      pure: "#7B294E",        // Vino elegante
      pureDark: "#561C36",    // Vino profundo
      text: "#4A1B32",        // Texto sobre fondo claro
      textDark: "#2C1020",    // Texto sobre fondo oscuro
      bg: "#F5E6ED",          // Fondo suave, rosado claro
      bgDark: "#BFA3B5",
    },
  } as ThemeColors,
};

// Colores semánticos universales
export const semantic = {
  accent: {
    pure: "#8A4EF6",
    pureDark: "#683BB9",
    text: "#432578",
    textDark: "#281648",
    bg: "#E8D9F9",
    bgDark: "#AEA3BB",
  },
  success: {
    pure: "#3DFF94",
    pureDark: "#2DBF6F",
    text: "#45574d",
    textDark: "#33413A",
    bg: "#cffae3",
    bgDark: "#9BBDAA",
  },
  warning: {
    pure: "#FFEE3D",
    pureDark: "#BFB32F",
    text: "#6E671A",
    textDark: "#524D13",
    bg: "#FAF7DF",
    bgDark: "#BBB9A7",
  },
  danger: {
    pure: "#ED3A45",
    pureDark: "#B22B34",
    text: "#6B1A1F",
    textDark: "#501317",
    bg: "#F7DDDF",
    bgDark: "#B9A6A7",
  },
} as SemanticColors;

// Colores neutrales
export const neutral = {
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
};

// Exportación del objeto completo para facilitar la importación
export const colors = {
  themes,
  semantic,
  neutral,
};

export default colors;
