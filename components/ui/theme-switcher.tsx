"use client";

import { useTheme } from "@/app/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Check, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRipple } from "@/components/ripple/RippleProvider";
import { CustomPaletteIcon } from "./icons/custom-palette-icon";
import { createColorTokens, updateColorTokens } from "@/lib/theme/color-tokens";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { useColorTokens } from "@/hooks/use-color-tokens";

export function ThemeSwitcher() {
  const { colorScheme, mode, setColorScheme, setMode } = useTheme();
  const { component } = useColorTokens();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ripple = useRipple();
  const [forceUpdate, setForceUpdate] = useState({});

  // Usar directamente los tokens del navbar desde el sistema global
  const navTokens = component.navbar;

  // Constantes para el ripple usando los tokens de navegación
  const RIPPLE_COLOR = navTokens.active.bg;
  const RIPPLE_SCALE = 8;

  // Efecto para forzar actualización cuando cambia el tema
  useEffect(() => {
    setForceUpdate({});
  }, [colorScheme, mode]);

  // Función para alternar entre modo claro y oscuro
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);

    // Forzar actualización de tokens
    const newTokens = createColorTokens(colorScheme, newMode);
    updateColorTokens(newTokens);

    // Forzar re-renderizado
    setTimeout(() => {
      setForceUpdate({});
    }, 0);
  };

  // Función directa para cambiar el esquema de color
  const handleColorSchemeChange = (scheme: "blue" | "green" | "orange") => {
    // Aplicamos el cambio de esquema
    setColorScheme(scheme);

    // Forzar actualización de tokens
    const newTokens = createColorTokens(scheme, mode);
    updateColorTokens(newTokens);

    // Cerramos el menú
    setIsOpen(false);

    // Forzar re-renderizado
    setTimeout(() => {
      setForceUpdate({});
    }, 0);
  };

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Variantes de animación para el menú
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeInOut",
      },
    },
  };

  // Variantes para los elementos del menú
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.05,
        duration: 0.2,
        ease: "easeOut",
      },
    }),
  };

  // Variantes para el indicador de selección
  const checkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  };

  // Variantes para el círculo de color
  const colorCircleVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, transition: { duration: 0.2 } },
  };

  // Estilos para el botón y elementos del menú usando los tokens de navegación
  const buttonStyle = {
    backgroundColor: "transparent",
    color: navTokens.icon.default,
  };

  const buttonHoverStyle = {
    backgroundColor: navTokens.hover.bg,
    color: navTokens.icon.active,
  };

  const menuItemStyle = {
    color: navTokens.icon.default,
  };

  const menuItemHoverStyle = {
    backgroundColor: navTokens.hover.bg,
    color: navTokens.icon.active,
  };

  const menuBackgroundStyle = {
    backgroundColor: navTokens.submenu.background,
    borderColor: navTokens.submenu.border,
    boxShadow: navTokens.shadow,
  };

  return (
    <div className="flex items-center gap-2">
      {/* Switch para alternar entre modo claro y oscuro */}
      <div
        className="flex items-center gap-1.5"
        onMouseDown={(e) => ripple(e.nativeEvent, RIPPLE_COLOR, RIPPLE_SCALE)}
      >
        <Icon size="xs" color="neutral" colorVariant="pure">
          <Sun />
        </Icon>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Switch
            checked={mode === "dark"}
            onCheckedChange={toggleMode}
            aria-label={
              mode === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            }
          />
        </motion.div>
        <Icon size="xs" color="neutral" colorVariant="pure">
          <Moon />
        </Icon>
      </div>

      {/* Selector de esquema de color */}
      <div className="relative">
        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.05, ...buttonHoverStyle }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseDown={(e) => ripple(e.nativeEvent, RIPPLE_COLOR, RIPPLE_SCALE)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors"
          style={buttonStyle}
          aria-label="Seleccionar esquema de color"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <CustomPaletteIcon
            className={`h-[22px] w-[22px] ${
              colorScheme === "blue"
                ? "text-blue-600"
                : colorScheme === "green"
                ? "text-green-600"
                : "text-orange-500"
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border p-2"
              style={menuBackgroundStyle}
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="grid gap-1">
                <motion.button
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 transition-colors"
                  style={
                    colorScheme === "blue"
                      ? { ...menuItemStyle, ...menuItemHoverStyle }
                      : menuItemStyle
                  }
                  whileHover={menuItemHoverStyle}
                  onClick={() => handleColorSchemeChange("blue")}
                  onMouseDown={(e) =>
                    ripple(e.nativeEvent, RIPPLE_COLOR, RIPPLE_SCALE)
                  }
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="h-4 w-4 rounded-full bg-blue-600"
                      variants={colorCircleVariants}
                      initial="initial"
                      whileHover="hover"
                    />
                    <Text color="secondary" colorVariant="text" size="sm">
                      Azul
                    </Text>
                  </div>
                  {colorScheme === "blue" && (
                    <motion.div
                      variants={checkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Icon size="xs" color="primary" colorVariant="pure">
                        <Check />
                      </Icon>
                    </motion.div>
                  )}
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 transition-colors"
                  style={
                    colorScheme === "green"
                      ? { ...menuItemStyle, ...menuItemHoverStyle }
                      : menuItemStyle
                  }
                  whileHover={menuItemHoverStyle}
                  onClick={() => handleColorSchemeChange("green")}
                  onMouseDown={(e) =>
                    ripple(e.nativeEvent, RIPPLE_COLOR, RIPPLE_SCALE)
                  }
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="h-4 w-4 rounded-full bg-green-600"
                      variants={colorCircleVariants}
                      initial="initial"
                      whileHover="hover"
                    />
                    <Text color="secondary" colorVariant="text" size="sm">
                      Verde
                    </Text>
                  </div>
                  {colorScheme === "green" && (
                    <motion.div
                      variants={checkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Icon size="xs" color="primary" colorVariant="pure">
                        <Check />
                      </Icon>
                    </motion.div>
                  )}
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 transition-colors"
                  style={
                    colorScheme === "orange"
                      ? { ...menuItemStyle, ...menuItemHoverStyle }
                      : menuItemStyle
                  }
                  whileHover={menuItemHoverStyle}
                  onClick={() => handleColorSchemeChange("orange")}
                  onMouseDown={(e) =>
                    ripple(e.nativeEvent, RIPPLE_COLOR, RIPPLE_SCALE)
                  }
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="h-4 w-4 rounded-full bg-orange-500"
                      variants={colorCircleVariants}
                      initial="initial"
                      whileHover="hover"
                    />
                    <Text color="secondary" colorVariant="text" size="sm">
                      Naranja
                    </Text>
                  </div>
                  {colorScheme === "orange" && (
                    <motion.div
                      variants={checkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Icon size="xs" color="primary" colorVariant="pure">
                        <Check />
                      </Icon>
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
