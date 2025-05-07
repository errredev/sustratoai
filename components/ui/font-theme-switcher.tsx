"use client";

import { useFontTheme } from "@/app/font-provider";
import { Check, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRipple } from "@/components/ripple/RippleProvider";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/app/theme-provider";
import { useColorTokens } from "@/hooks/use-color-tokens";
import { fontThemeConfig } from "@/lib/fonts";

export function FontThemeSwitcher() {
  const { fontTheme, setFontTheme } = useFontTheme();
  const { mode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ripple = useRipple();
  const { component } = useColorTokens();

  // Usar directamente los tokens del navbar desde el sistema global
  const navTokens = component.navbar;

  // Constantes para el ripple usando los tokens de navegación
  const RIPPLE_COLOR = navTokens.active.bg;
  const RIPPLE_SCALE = 8;

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node) &&
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

  // Definición de los estilos de fuente
  const fontStyles = [
    {
      id: "sustrato",
      name: "Sustrato",
      style: {
        fontFamily: "var(--font-ubuntu), 'Ubuntu', sans-serif",
        fontWeight: "700",
      },
    },
    {
      id: "classic",
      name: "Clásico",
      style: {
        fontFamily: fontThemeConfig.classic.heading,
        fontWeight: fontThemeConfig.classic.headingWeight,
      },
    },
    {
      id: "modern",
      name: "Moderno",
      style: {
        fontFamily: fontThemeConfig.modern.heading,
        fontWeight: fontThemeConfig.modern.headingWeight,
      },
    },
    {
      id: "accessible",
      name: "Accesible",
      style: {
        fontFamily: fontThemeConfig.accessible.heading,
        fontWeight: fontThemeConfig.accessible.headingWeight,
        letterSpacing: fontThemeConfig.accessible.letterSpacingHeadings,
      },
    },
    {
      id: "technical",
      name: "Técnico",
      style: {
        fontFamily: fontThemeConfig.technical.heading,
        fontWeight: fontThemeConfig.technical.headingWeight,
        letterSpacing: fontThemeConfig.technical.letterSpacingHeadings,
      },
    },
    {
      id: "minimalist",
      name: "Minimalista",
      style: {
        fontFamily: fontThemeConfig.minimalist.heading,
        fontWeight: fontThemeConfig.minimalist.headingWeight,
        letterSpacing: fontThemeConfig.minimalist.letterSpacingHeadings,
      },
    },
    {
      id: "creative",
      name: "Creativo",
      style: {
        fontFamily: fontThemeConfig.creative.heading,
        fontWeight: fontThemeConfig.creative.headingWeight,
        letterSpacing: fontThemeConfig.creative.letterSpacingHeadings,
      },
    },
  ];

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05, ...buttonHoverStyle }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={(e) => ripple(e.nativeEvent, RIPPLE_COLOR, RIPPLE_SCALE)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors"
        style={buttonStyle}
        aria-label="Seleccionar fuente"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon size="sm" color="primary" colorVariant="pure" strokeOnly={true}>
          <Type />
        </Icon>
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
            <div className="grid gap-1 max-h-[300px] overflow-y-auto">
              {fontStyles.map((font, index) => (
                <motion.button
                  key={font.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 transition-colors"
                  style={
                    fontTheme === font.id
                      ? { ...menuItemStyle, ...menuItemHoverStyle }
                      : menuItemStyle
                  }
                  whileHover={menuItemHoverStyle}
                  onClick={() => {
                    setFontTheme(font.id as any);
                    setIsOpen(false);
                  }}
                  onMouseDown={(e) =>
                    ripple(e.nativeEvent, RIPPLE_COLOR, RIPPLE_SCALE)
                  }
                >
                  <div className="flex items-center gap-2">
                    {/* Usar el componente Text para mostrar el nombre con la fuente correspondiente */}
                    <span style={font.style} className="text-sm">
                      {font.name}
                    </span>
                  </div>
                  {fontTheme === font.id && (
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
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
