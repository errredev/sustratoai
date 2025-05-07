import { ColorScheme, Mode } from "../types";
import colors from "../colors";

export type CardVariant = "default" | "bordered" | "elevated" | "ghost";

export interface CardTokens {
  variants: {
    [key in CardVariant]: {
      background: string;
      border: string;
      shadow: string;
    };
  };
  sizes: {
    sm: {
      padding: string;
      borderRadius: string;
    };
    md: {
      padding: string;
      borderRadius: string;
    };
    lg: {
      padding: string;
      borderRadius: string;
    };
  };
}

export function generateCardTokens(
  colorScheme: ColorScheme,
  mode: Mode
): CardTokens {
  const isDark = mode === "dark";

  return {
    variants: {
      default: {
        background: isDark ? "bg-gray-800" : "bg-white",
        border: "border-0",
        shadow: "shadow-none",
      },
      bordered: {
        background: isDark ? "bg-gray-800" : "bg-white",
        border: isDark ? "border border-gray-700" : "border border-gray-200",
        shadow: "shadow-none",
      },
      elevated: {
        background: isDark ? "bg-gray-800" : "bg-white",
        border: "border-0",
        shadow: isDark
          ? "shadow-lg shadow-black/20"
          : "shadow-lg shadow-gray-200/50",
      },
      ghost: {
        background: "bg-transparent",
        border: "border-0",
        shadow: "shadow-none",
      },
    },
    sizes: {
      sm: {
        padding: "p-3",
        borderRadius: "rounded-md",
      },
      md: {
        padding: "p-4",
        borderRadius: "rounded-lg",
      },
      lg: {
        padding: "p-6",
        borderRadius: "rounded-xl",
      },
    },
  };
}

export const cardTokens = generateCardTokens("blue", "light");
