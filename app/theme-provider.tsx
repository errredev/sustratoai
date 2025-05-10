"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  createColorTokens as createLegacyColorTokens,
  updateColorTokens as updateLegacyColorTokens,
  type ColorTokens as LegacyColorTokens,
  type ColorScheme,
  type Mode,
} from "@/lib/theme/color-tokens";

import {
  createAppColorTokens,
  updateAppColorTokens,
  type AppColorTokens,
} from "@/lib/theme/ColorToken";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  colorScheme: ColorScheme;
  mode: Mode;
  setColorScheme: (colorScheme: ColorScheme) => void;
  setMode: (mode: Mode) => void;
  legacyColorTokens: LegacyColorTokens;
  appColorTokens: AppColorTokens;
  theme: string;
  setTheme: (theme: string) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [colorScheme, setColorSchemeInternal] = useState<ColorScheme>("blue");
  const [mode, setModeInternal] = useState<Mode>("light");

  const [appTokensState, setAppTokensState] = useState<AppColorTokens>(() => {
    const initialAppTokens = createAppColorTokens("blue", "light");
    updateAppColorTokens(initialAppTokens);
    return initialAppTokens;
  });

  const [legacyTokensState, setLegacyTokensState] = useState<LegacyColorTokens>(
    () => {
      const tokens = createLegacyColorTokens("blue", "light");
      updateLegacyColorTokens(tokens);
      return tokens;
    }
  );

  const theme =
    mode === "dark"
      ? "dark"
      : colorScheme === "blue"
      ? "light"
      : `theme-${colorScheme}`;

  const updateAllTokens = (newColorScheme: ColorScheme, newMode: Mode) => {
    const newAppTokens = createAppColorTokens(newColorScheme, newMode);
    setAppTokensState(newAppTokens);
    updateAppColorTokens(newAppTokens);

    const newLegacyTokens = createLegacyColorTokens(newColorScheme, newMode);
    setLegacyTokensState(newLegacyTokens);
    updateLegacyColorTokens(newLegacyTokens);
  };

  const handleSetColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeInternal(newColorScheme);
    updateAllTokens(newColorScheme, mode);
  };

  const handleSetMode = (newMode: Mode) => {
    setModeInternal(newMode);
    updateAllTokens(colorScheme, newMode);
  };

  const setTheme = (newTheme: string) => {
    let newMode: Mode = mode;
    let newColorScheme: ColorScheme = colorScheme;

    if (newTheme === "dark") {
      newMode = "dark";
    } else if (newTheme === "light") {
      newMode = "light";
      newColorScheme = "blue";
    } else if (newTheme === "theme-green") {
      newMode = "light";
      newColorScheme = "green";
    } else if (newTheme === "theme-orange") {
      newMode = "light";
      newColorScheme = "orange";
    }
    setModeInternal(newMode);
    setColorSchemeInternal(newColorScheme);
    updateAllTokens(newColorScheme, newMode);
  };

  useEffect(() => {
    updateAllTokens(colorScheme, mode);
  }, [colorScheme, mode]);

  useEffect(() => {
    let initialColorScheme = "blue" as ColorScheme;
    let initialMode = "light" as Mode;

    try {
      const storedColorScheme = localStorage.getItem(
        "colorScheme"
      ) as ColorScheme;
      const storedMode = localStorage.getItem("mode") as Mode;

      if (
        storedColorScheme &&
        ["blue", "green", "orange"].includes(storedColorScheme)
      ) {
        initialColorScheme = storedColorScheme;
      }

      if (storedMode && ["light", "dark"].includes(storedMode)) {
        initialMode = storedMode;
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        initialMode = "dark";
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }

    setColorSchemeInternal(initialColorScheme);
    setModeInternal(initialMode);
  }, []);

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      root.classList.remove(
        "dark",
        "theme-blue",
        "theme-green",
        "theme-orange"
      );

      if (mode === "dark") {
        root.classList.add("dark");
      }

      if (colorScheme !== "blue" || mode === "light") {
        if (colorScheme !== "blue") root.classList.add(`theme-${colorScheme}`);
      }

      localStorage.setItem("colorScheme", colorScheme);
      localStorage.setItem("mode", mode);
    } catch (error) {
      console.error("Error updating documentElement or localStorage:", error);
    }
  }, [colorScheme, mode]);

  const value = {
    colorScheme,
    mode,
    setColorScheme: handleSetColorScheme,
    setMode: handleSetMode,
    legacyColorTokens: legacyTokensState,
    appColorTokens: appTokensState,
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
