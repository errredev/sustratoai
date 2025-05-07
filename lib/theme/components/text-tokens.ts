import tinycolor from "tinycolor2";
import colors from "../colors";
import type { ColorScheme, Mode } from "../color-tokens";

export type TextTokens = {
  colors: {
    default: { pure: string; text: string; dark: string };
    primary: { pure: string; text: string; dark: string };
    secondary: { pure: string; text: string; dark: string };
    tertiary: { pure: string; text: string; dark: string };
    accent: { pure: string; text: string; dark: string };
    success: { pure: string; text: string; dark: string };
    warning: { pure: string; text: string; dark: string };
    danger: { pure: string; text: string; dark: string };
    muted: { pure: string; text: string; dark: string };
    neutral: { pure: string; text: string; dark: string };
  };
  gradients: {
    primary: { start: string; middle: string; end: string };
    secondary: { start: string; middle: string; end: string };
    tertiary: { start: string; middle: string; end: string };
    accent: { start: string; middle: string; end: string };
    success: { start: string; middle: string; end: string };
    warning: { start: string; middle: string; end: string };
    danger: { start: string; middle: string; end: string };
  };
  variants: {
    default: { size: string; weight: string; color: string };
    heading: { size: string; weight: string; color: string };
    subheading: { size: string; weight: string; color: string };
    title: { size: string; weight: string; color: string };
    subtitle: { size: string; weight: string; color: string };
    label: { size: string; weight: string; color: string };
    caption: { size: string; weight: string; color: string };
    muted: { size: string; weight: string; color: string };
  };
};

function ensureContrast(
  color: string,
  background: string,
  minRatio = 4.5
): string {
  let tc = tinycolor(color);
  if (tinycolor.readability(tc, background) >= minRatio) {
    return tc.toHexString();
  }
  const bgIsDark = tinycolor(background).isDark();
  let step = 0;
  while (tinycolor.readability(tc, background) < minRatio && step < 20) {
    tc = bgIsDark ? tc.lighten(5) : tc.darken(5);
    step++;
  }
  return tc.toHexString();
}

export function generateTextTokens(colorScheme: ColorScheme, mode: Mode) {
  const isDark = mode === "dark";
  const theme = colors.themes[colorScheme];
  const semantic = colors.semantic;
  const neutral = colors.neutral;

  // Fondo oscuro sobre el que contrastaremos
  const darkBackground = neutral.gray[900] || "#000";

  // Helper para sets de color planos
  const getColorSet = (obj: any) => ({
    pure: isDark ? obj.pureDark : obj.pure,
    text: isDark ? obj.textDark : obj.text,
    dark: obj.textDark,
  });

  // Sets base (sin contraste extra)
  const baseTextColors = {
    default: {
      pure: isDark ? neutral.white : neutral.black,
      text: isDark ? neutral.gray[100] : neutral.gray[900],
      dark: neutral.gray[700],
    },
    primary: getColorSet(theme.primary),
    secondary: getColorSet(theme.secondary),
    tertiary: getColorSet(theme.tertiary),
    accent: getColorSet(semantic.accent),
    success: getColorSet(semantic.success),
    warning: getColorSet(semantic.warning),
    danger: getColorSet(semantic.danger),
    muted: {
      pure: isDark ? neutral.gray[300] : neutral.gray[600],
      text: isDark ? neutral.gray[400] : neutral.gray[500],
      dark: neutral.gray[600],
    },
    neutral: {
      pure: isDark ? neutral.gray[200] : neutral.gray[700],
      text: isDark ? neutral.gray[300] : neutral.gray[600],
      dark: neutral.gray[700],
    },
  };

  // Aplicamos ensureContrast solo en modo dark
  const textColors = Object.fromEntries(
    Object.entries(baseTextColors).map(([key, set]) => {
      if (!isDark) return [key, set];
      return [
        key,
        {
          pure: ensureContrast(set.pure, darkBackground),
          text: ensureContrast(set.text, darkBackground),
          dark: ensureContrast(set.dark, darkBackground),
        },
      ];
    })
  ) as typeof baseTextColors;

  // Gradientes "crudos"
  const rawGradients = {
    primary: {
      start: isDark ? theme.primary.pureDark : theme.primary.pure,
      middle: isDark ? theme.primary.textDark : theme.primary.text,
      end: theme.primary.textDark,
    },
    secondary: {
      start: isDark ? theme.secondary.pureDark : theme.secondary.pure,
      middle: isDark ? theme.secondary.textDark : theme.secondary.text,
      end: theme.secondary.textDark,
    },
    tertiary: {
      start: isDark ? theme.tertiary.pureDark : theme.tertiary.pure,
      middle: isDark ? theme.tertiary.textDark : theme.tertiary.text,
      end: theme.tertiary.textDark,
    },
    accent: {
      start: isDark ? semantic.accent.pureDark : semantic.accent.pure,
      middle: isDark ? semantic.accent.textDark : semantic.accent.text,
      end: semantic.accent.textDark,
    },
    success: {
      start: isDark ? semantic.success.pureDark : semantic.success.pure,
      middle: isDark ? semantic.success.textDark : semantic.success.text,
      end: semantic.success.textDark,
    },
    warning: {
      start: isDark ? semantic.warning.pureDark : semantic.warning.pure,
      middle: isDark ? semantic.warning.textDark : semantic.warning.text,
      end: semantic.warning.textDark,
    },
    danger: {
      start: isDark ? semantic.danger.pureDark : semantic.danger.pure,
      middle: isDark ? semantic.danger.textDark : semantic.danger.text,
      end: semantic.danger.textDark,
    },
  } as const;

  // Y ahora ajustamos contraste de cada punto del gradiente
  const textGradients = Object.fromEntries(
    Object.entries(rawGradients).map(([key, grad]) => {
      if (!isDark) return [key, grad];
      return [
        key,
        {
          start: ensureContrast(grad.start, darkBackground),
          middle: ensureContrast(grad.middle, darkBackground),
          end: ensureContrast(grad.end, darkBackground),
        },
      ];
    })
  ) as typeof rawGradients;

  const variantDefaults = {
    default: { size: "base", weight: "normal", color: "default" },
    heading: { size: "3xl", weight: "bold", color: "default" },
    subheading: { size: "2xl", weight: "semibold", color: "default" },
    title: { size: "xl", weight: "semibold", color: "primary" },
    subtitle: { size: "lg", weight: "medium", color: "secondary" },
    label: { size: "sm", weight: "medium", color: "default" },
    caption: { size: "xs", weight: "normal", color: "muted" },
    muted: { size: "sm", weight: "normal", color: "muted" },
  } as const;

  return {
    colors: textColors,
    gradients: textGradients,
    variants: variantDefaults,
  };
}
