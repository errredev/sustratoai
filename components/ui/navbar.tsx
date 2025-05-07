"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Menu,
  X,
  FileText,
  Database,
  Settings,
  Building,
  Users,
  MessageSquare,
  Home,
  BookOpen,
  UserCircle,
  LayoutDashboard,
  FileSpreadsheet,
  Layers,
  LogOut,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { FontThemeSwitcher } from "@/components/ui/font-theme-switcher";
import { AnimatePresence } from "framer-motion";
import { SustratoLogo } from "@/components/ui/sustrato-logo";
import { useRipple } from "@/components/ripple/RippleProvider";
import { useColorTokens } from "@/hooks/use-color-tokens";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/app/theme-provider";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/app/auth-provider";
import { toast } from "sonner";

// Variantes de animación para elementos del menú
const menuItemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

// Variantes para el submenú
const submenuVariants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
      when: "beforeChildren",
    },
  },
};

// Variantes para el ícono de flecha
const arrowVariants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

// Escala para el ripple del navbar
const NAVBAR_RIPPLE_SCALE = 9;

export function Navbar() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ripple = useRipple();
  const { component } = useColorTokens();
  const { mode, colorScheme } = useTheme();
  const { logout } = useAuth();

  // Usar directamente los tokens del navbar desde el sistema global
  const navTokens = component.navbar;

  // Colores para el ripple - Actualizados para usar el color de fondo activo
  const MENU_RIPPLE_COLOR = navTokens.active.bg;
  const SUBMENU_RIPPLE_COLOR = navTokens.active.bg;

  // Función para verificar si un submenu está activo
  const isSubmenuActive = (item: any) => {
    if (!item.submenu) return false;
    return item.submenu.some(
      (subitem: any) =>
        pathname === subitem.href ||
        (subitem.href !== "/" && pathname.startsWith(subitem.href))
    );
  };

  // Crear los elementos del menú con los colores correctos
  const navItems = useMemo(
    () => [
      {
        label: "Inicio",
        href: "/",
        icon: (isActive: boolean) => (
          <Icon
            size="sm"
            gradient={true}
            strokeOnly={!isActive}
            color="tertiary"
            colorVariant="bg"
            gradientWith="accent"
            gradientColorVariant="text"
            className="mr-2"
          >
            <Home />
          </Icon>
        ),
      },
      {
        label: "Transcripciones",
        href: "/transcripciones",
        icon: (isActive: boolean) => (
          <Icon
            size="sm"
            gradient={true}
            strokeOnly={!isActive}
            color="tertiary"
            colorVariant="bg"
            gradientWith="accent"
            gradientColorVariant="text"
            className="mr-2"
          >
            <FileText />
          </Icon>
        ),
        submenu: [
          {
            label: "Entrevistas",
            href: "/entrevistas",
            icon: (isActive: boolean) => (
              <Icon
                size="sm"
                gradient={true}
                strokeOnly={!isActive}
                color="tertiary"
                colorVariant="bg"
                gradientWith="accent"
                gradientColorVariant="text"
                className="mr-2"
              >
                <MessageSquare />
              </Icon>
            ),
          },
          {
            label: "Transcripciones",
            href: "/transcripciones",
            icon: (isActive: boolean) => (
              <Icon
                size="sm"
                gradient={true}
                strokeOnly={!isActive}
                color="tertiary"
                colorVariant="bg"
                gradientWith="accent"
                gradientColorVariant="text"
                className="mr-2"
              >
                <FileSpreadsheet />
              </Icon>
            ),
          },
          {
            label: "Matriz de Vaciado",
            href: "/matriz",
            icon: (isActive: boolean) => (
              <Icon
                size="sm"
                gradient={true}
                strokeOnly={!isActive}
                color="tertiary"
                colorVariant="bg"
                gradientWith="accent"
                gradientColorVariant="text"
                className="mr-2"
              >
                <Layers />
              </Icon>
            ),
          },
        ],
      },
      {
        label: "Artículos",
        href: "/articulos",
        icon: (isActive: boolean) => (
          <Icon
            size="sm"
            gradient={true}
            strokeOnly={!isActive}
            color="tertiary"
            colorVariant="bg"
            gradientWith="accent"
            gradientColorVariant="text"
            className="mr-2"
          >
            <BookOpen />
          </Icon>
        ),
        submenu: [
          {
            label: "Preclasificación",
            href: "/articulos/preclasificacion",
            icon: (isActive: boolean) => (
              <Icon
                size="sm"
                gradient={true}
                strokeOnly={!isActive}
                color="tertiary"
                colorVariant="bg"
                gradientWith="accent"
                gradientColorVariant="text"
                className="mr-2"
              >
                <LayoutDashboard />
              </Icon>
            ),
          },
        ],
      },
      {
        label: "Configuración",
        href: "/configuracion",
        icon: (isActive: boolean) => (
          <Icon
            size="sm"
            gradient={true}
            strokeOnly={!isActive}
            color="tertiary"
            colorVariant="bg"
            gradientWith="accent"
            gradientColorVariant="text"
            className="mr-2"
          >
            <Settings />
          </Icon>
        ),
        submenu: [
          {
            label: "Instituciones",
            href: "/instituciones",
            icon: (isActive: boolean) => (
              <Icon
                size="sm"
                gradient={true}
                strokeOnly={!isActive}
                color="tertiary"
                colorVariant="bg"
                gradientWith="accent"
                gradientColorVariant="text"
                className="mr-2"
              >
                <Building />
              </Icon>
            ),
          },
          {
            label: "Entrevistados",
            href: "/entrevistados",
            icon: (isActive: boolean) => (
              <Icon
                size="sm"
                gradient={true}
                strokeOnly={!isActive}
                color="tertiary"
                colorVariant="bg"
                gradientWith="accent"
                gradientColorVariant="text"
                className="mr-2"
              >
                <UserCircle />
              </Icon>
            ),
          },
          {
            label: "Investigadores",
            href: "/configuracion/investigadores",
            icon: (isActive: boolean) => (
              <Icon
                size="sm"
                gradient={true}
                strokeOnly={!isActive}
                color="tertiary"
                colorVariant="bg"
                gradientWith="accent"
                gradientColorVariant="text"
                className="mr-2"
              >
                <Users />
              </Icon>
            ),
          },
          {
            label: "Dimensiones Matriz",
            href: "/configuracion/dimensiones",
            icon: (isActive: boolean) => (
              <Icon
                size="sm"
                gradient={true}
                strokeOnly={!isActive}
                color="tertiary"
                colorVariant="bg"
                gradientWith="accent"
                gradientColorVariant="text"
                className="mr-2"
              >
                <Database />
              </Icon>
            ),
          },
          {
            label: "Expresiones Permitidas",
            href: "/configuracion/expresiones-permitidas",
            icon: (isActive: boolean) => (
              <Icon
                size="sm"
                gradient={true}
                strokeOnly={!isActive}
                color="tertiary"
                colorVariant="bg"
                gradientWith="accent"
                gradientColorVariant="text"
                className="mr-2"
              >
                <MessageSquare />
              </Icon>
            ),
          },
        ],
      },
    ],
    [pathname]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openSubmenu && !(event.target as Element).closest("[data-submenu]")) {
        setOpenSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSubmenu]);

  const toggleSubmenu = (label: string, e: React.MouseEvent) => {
    ripple(e.nativeEvent, MENU_RIPPLE_COLOR, NAVBAR_RIPPLE_SCALE);
    if (openSubmenu === label) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(label);
    }
  };

  // Estilo para el gradiente de la barra inferior
  const gradientBarStyle = {
    background: `linear-gradient(to right, ${navTokens.gradientBar.start}, ${navTokens.gradientBar.middle}, ${navTokens.gradientBar.end})`,
  };

  // Usar directamente el color de fondo del token
  const backgroundColor = scrolled
    ? navTokens.background.scrolled
    : navTokens.background.normal;

  // Estilo para el fondo del navbar
  const navBackgroundStyle = {
    backgroundColor,
    boxShadow: scrolled ? navTokens.shadow : "none",
    borderBottom: scrolled
      ? `1px solid ${
          mode === "dark" ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.8)"
        }`
      : "none",
    backdropFilter: scrolled ? "blur(8px)" : "none",
  };

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <>
      <motion.nav
        className={cn("sticky top-0 z-40 w-full transition-all")}
        style={navBackgroundStyle}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link
                href="/"
                className="flex items-center"
                onMouseDown={(e) =>
                  ripple(e.nativeEvent, MENU_RIPPLE_COLOR, NAVBAR_RIPPLE_SCALE)
                }
              >
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <SustratoLogo
                        className="mr-2"
                        size={28}
                        primaryColor={navTokens.logo.primary}
                        secondaryColor={navTokens.logo.secondary}
                        accentColor={navTokens.logo.accent}
                      />
                      <div className="font-bold text-xl md:text-2xl">
                        <span
                          className="bg-clip-text text-transparent font-bold"
                          style={{
                            backgroundImage: navTokens.logo.titleGradient,
                            fontFamily: "'Chau Philomene One', sans-serif", // Asegurar que siempre use esta fuente
                          }}
                        >
                          Sustrato.ai
                        </span>
                      </div>
                    </div>
                    <Text
                      size="xs"
                      color="neutral"
                      colorVariant="pure"
                      className="ml-0.5 mt-0.5"
                      style={{ marginLeft: "0.5rem" }}
                    >
                      cultivando sinergias humano·AI
                    </Text>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <FontThemeSwitcher />
              <ThemeSwitcher />
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  onMouseDown={(e) =>
                    ripple(
                      e.nativeEvent,
                      MENU_RIPPLE_COLOR,
                      NAVBAR_RIPPLE_SCALE
                    )
                  }
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <Icon
                      size="sm"
                      gradient={true}
                      strokeOnly={true}
                      color="tertiary"
                      colorVariant="bg"
                      gradientWith="accent"
                      gradientColorVariant="text"
                    >
                      <X />
                    </Icon>
                  ) : (
                    <Icon
                      size="sm"
                      gradient={true}
                      strokeOnly={true}
                      color="tertiary"
                      colorVariant="bg"
                      gradientWith="accent"
                      gradientColorVariant="text"
                    >
                      <Menu />
                    </Icon>
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href || item.label}
                  className="relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {item.submenu ? (
                    <div className="relative">
                      <motion.button
                        onClick={(e) => toggleSubmenu(item.label, e)}
                        onMouseDown={(e) =>
                          ripple(
                            e.nativeEvent,
                            MENU_RIPPLE_COLOR,
                            NAVBAR_RIPPLE_SCALE
                          )
                        }
                        data-submenu="trigger"
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          pathname === item.href || isSubmenuActive(item)
                            ? "bg-opacity-100"
                            : "hover:bg-opacity-100"
                        )}
                        style={{
                          backgroundColor:
                            pathname === item.href || isSubmenuActive(item)
                              ? navTokens.active.bg
                              : "transparent",
                        }}
                        whileHover={{
                          backgroundColor:
                            pathname === item.href || isSubmenuActive(item)
                              ? navTokens.active.bg
                              : navTokens.hover.bg,
                          scale: 1.05,
                          transition: { duration: 0.2 },
                        }}
                        whileTap={menuItemVariants.tap}
                      >
                        {item.icon(
                          pathname === item.href || isSubmenuActive(item)
                        )}
                        {/* Primer nivel: usar fuente de heading */}
                        <Text
                          color={
                            pathname === item.href || isSubmenuActive(item)
                              ? "secondary"
                              : "neutral"
                          }
                          colorVariant={
                            pathname === item.href || isSubmenuActive(item)
                              ? "pure"
                              : "text"
                          }
                          weight="medium"
                          size="sm"
                          fontType="heading" // Especificar explícitamente que use la fuente de heading
                        >
                          {item.label}
                        </Text>
                        <motion.div
                          variants={arrowVariants}
                          initial="closed"
                          animate={
                            openSubmenu === item.label ? "open" : "closed"
                          }
                          transition={{ duration: 0.2 }}
                        >
                          <Icon
                            size="xs"
                            gradient={true}
                            strokeOnly={true}
                            color="tertiary"
                            colorVariant="bg"
                            gradientWith="accent"
                            gradientColorVariant="text"
                            className="ml-1"
                          >
                            <ChevronDown />
                          </Icon>
                        </motion.div>
                      </motion.button>
                      <AnimatePresence>
                        {openSubmenu === item.label && (
                          <motion.div
                            className="absolute z-10 left-0 mt-2 w-56 origin-top-left rounded-md shadow-lg ring-1 focus:outline-none"
                            style={{
                              backgroundColor: navTokens.submenu.background,
                              borderColor: navTokens.submenu.border,
                              boxShadow: navTokens.shadow,
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={submenuVariants}
                            data-submenu="content"
                          >
                            <div className="py-1">
                              {item.submenu.map((subitem, subIndex) => (
                                <motion.div
                                  key={subitem.href}
                                  variants={menuItemVariants}
                                  whileHover={{
                                    backgroundColor:
                                      pathname === subitem.href
                                        ? navTokens.active.bg
                                        : navTokens.hover.bg,
                                    scale: 1.05,
                                    transition: { duration: 0.2 },
                                  }}
                                  whileTap={menuItemVariants.tap}
                                >
                                  <Link
                                    href={subitem.href}
                                    className="block px-4 py-2 text-sm flex items-center transition-colors"
                                    style={{
                                      backgroundColor:
                                        pathname === subitem.href
                                          ? navTokens.active.bg
                                          : "transparent",
                                    }}
                                    onClick={() => setOpenSubmenu(null)}
                                    onMouseDown={(e) =>
                                      ripple(
                                        e.nativeEvent,
                                        SUBMENU_RIPPLE_COLOR,
                                        NAVBAR_RIPPLE_SCALE
                                      )
                                    }
                                  >
                                    {subitem.icon(pathname === subitem.href)}
                                    {/* Submenú: usar fuente de body y color tertiary */}
                                    <Text
                                      color={
                                        pathname === subitem.href
                                          ? "secondary"
                                          : "tertiary"
                                      }
                                      colorVariant={
                                        pathname === subitem.href
                                          ? "pure"
                                          : "text"
                                      }
                                      weight={
                                        pathname === subitem.href
                                          ? "medium"
                                          : "normal"
                                      }
                                      size="sm"
                                      fontType="body" // Especificar explícitamente que use la fuente de body
                                    >
                                      {subitem.label}
                                    </Text>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{
                        backgroundColor:
                          pathname === item.href
                            ? navTokens.active.bg
                            : navTokens.hover.bg,
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={menuItemVariants.tap}
                      className="rounded-md"
                    >
                      <Link
                        href={item.disabled ? "#" : item.href}
                        className="px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center"
                        style={{
                          backgroundColor:
                            pathname === item.href
                              ? navTokens.active.bg
                              : "transparent",
                          opacity: item.disabled ? 0.5 : 1,
                          cursor: item.disabled ? "not-allowed" : "pointer",
                        }}
                        onClick={(e) => {
                          if (item.disabled) {
                            e.preventDefault();
                          }
                        }}
                        onMouseDown={(e) =>
                          ripple(
                            e.nativeEvent,
                            MENU_RIPPLE_COLOR,
                            NAVBAR_RIPPLE_SCALE
                          )
                        }
                      >
                        {item.icon(pathname === item.href)}
                        {/* Primer nivel: usar fuente de heading */}
                        <Text
                          color={
                            pathname === item.href ? "secondary" : "neutral"
                          }
                          colorVariant={
                            pathname === item.href ? "pure" : "text"
                          }
                          weight="medium"
                          size="base"
                          fontType="heading" // Especificar explícitamente que use la fuente de heading
                        >
                          {item.label}
                        </Text>
                        {item.disabled && (
                          <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                            Próximamente
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ))}
              {/* Añadir FontThemeSwitcher y ThemeSwitcher aquí */}
              <div className="flex items-center space-x-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
                >
                  <FontThemeSwitcher />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: navItems.length * 0.05 + 0.1,
                  }}
                >
                  <ThemeSwitcher />
                </motion.div>
              </div>
            </div>

            {/* Controles de la derecha */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Botón de cierre de sesión */}
              <Button
                variant="ghost"
                size="icon"
                className="mr-1"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                onMouseDown={(e) =>
                  ripple(e.nativeEvent, MENU_RIPPLE_COLOR, NAVBAR_RIPPLE_SCALE)
                }
              >
                <Icon
                  size="sm"
                  color="tertiary"
                  strokeOnly={true}
                  colorVariant="text"
                >
                  <LogOut size={18} />
                </Icon>
              </Button>

              {/* Botón de menú móvil */}
              <Button
                variant="ghost"
                size="icon"
                className="relative md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                onMouseDown={(e) =>
                  ripple(e.nativeEvent, MENU_RIPPLE_COLOR, NAVBAR_RIPPLE_SCALE)
                }
              >
                <Icon size="sm" color="tertiary" colorVariant="text">
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Icon>
              </Button>
            </div>
          </div>
        </div>

        {/* Línea decorativa degradada */}
        <div className="w-full h-1" style={gradientBarStyle} />

        {/* Mobile navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden border-b"
              style={{ backgroundColor }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-1 px-4 pb-3 pt-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href || item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {item.submenu ? (
                      <>
                        <motion.button
                          onClick={(e) => toggleSubmenu(item.label, e)}
                          onMouseDown={(e) =>
                            ripple(
                              e.nativeEvent,
                              MENU_RIPPLE_COLOR,
                              NAVBAR_RIPPLE_SCALE
                            )
                          }
                          data-submenu="trigger"
                          className="flex w-full items-center justify-between px-3 py-2 text-base font-medium rounded-md"
                          style={{
                            backgroundColor:
                              pathname === item.href || isSubmenuActive(item)
                                ? navTokens.active.bg
                                : "transparent",
                          }}
                          whileHover={{
                            backgroundColor:
                              pathname === item.href || isSubmenuActive(item)
                                ? navTokens.active.bg
                                : navTokens.hover.bg,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="flex items-center">
                            {item.icon(
                              pathname === item.href || isSubmenuActive(item)
                            )}
                            {/* Primer nivel móvil: usar fuente de heading */}
                            <Text
                              color={
                                pathname === item.href || isSubmenuActive(item)
                                  ? "secondary"
                                  : "neutral"
                              }
                              colorVariant={
                                pathname === item.href || isSubmenuActive(item)
                                  ? "pure"
                                  : "text"
                              }
                              weight="medium"
                              size="base"
                              fontType="heading" // Especificar explícitamente que use la fuente de heading
                            >
                              {item.label}
                            </Text>
                          </span>
                          <motion.div
                            variants={arrowVariants}
                            initial="closed"
                            animate={
                              openSubmenu === item.label ? "open" : "closed"
                            }
                            transition={{ duration: 0.2 }}
                          >
                            <Icon
                              size="xs"
                              gradient={true}
                              strokeOnly={true}
                              color="tertiary"
                              colorVariant="bg"
                              gradientWith="accent"
                              gradientColorVariant="text"
                            >
                              <ChevronDown />
                            </Icon>
                          </motion.div>
                        </motion.button>
                        <AnimatePresence>
                          {openSubmenu === item.label && (
                            <motion.div
                              className="pl-4 space-y-1"
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              variants={submenuVariants}
                              data-submenu="content"
                            >
                              {item.submenu.map((subitem, subIndex) => (
                                <motion.div
                                  key={subitem.href}
                                  variants={menuItemVariants}
                                  whileHover={{
                                    backgroundColor:
                                      pathname === subitem.href
                                        ? navTokens.active.bg
                                        : navTokens.hover.bg,
                                    scale: 1.05,
                                  }}
                                  whileTap={menuItemVariants.tap}
                                >
                                  <Link
                                    href={subitem.href}
                                    className="block px-3 py-2 text-sm rounded-md flex items-center transition-colors"
                                    style={{
                                      backgroundColor:
                                        pathname === subitem.href
                                          ? navTokens.active.bg
                                          : "transparent",
                                    }}
                                    onClick={() => {
                                      setOpenSubmenu(null);
                                      setMobileMenuOpen(false);
                                    }}
                                    onMouseDown={(e) =>
                                      ripple(
                                        e.nativeEvent,
                                        SUBMENU_RIPPLE_COLOR,
                                        NAVBAR_RIPPLE_SCALE
                                      )
                                    }
                                  >
                                    {subitem.icon(pathname === subitem.href)}
                                    {/* Submenú móvil: usar fuente de body y color tertiary */}
                                    <Text
                                      color={
                                        pathname === subitem.href
                                          ? "secondary"
                                          : "tertiary"
                                      }
                                      colorVariant={
                                        pathname === subitem.href
                                          ? "pure"
                                          : "text"
                                      }
                                      weight={
                                        pathname === subitem.href
                                          ? "medium"
                                          : "normal"
                                      }
                                      size="sm"
                                      fontType="body" // Especificar explícitamente que use la fuente de body
                                    >
                                      {subitem.label}
                                    </Text>
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <motion.div
                        whileHover={{
                          backgroundColor:
                            pathname === item.href
                              ? navTokens.active.bg
                              : navTokens.hover.bg,
                          scale: 1.05,
                        }}
                        whileTap={menuItemVariants.tap}
                        className="rounded-md"
                      >
                        <Link
                          href={item.disabled ? "#" : item.href}
                          className="block px-3 py-2 text-base font-medium rounded-md flex items-center"
                          style={{
                            backgroundColor:
                              pathname === item.href
                                ? navTokens.active.bg
                                : "transparent",
                            opacity: item.disabled ? 0.5 : 1,
                            cursor: item.disabled ? "not-allowed" : "pointer",
                          }}
                          onClick={(e) => {
                            if (item.disabled) {
                              e.preventDefault();
                            } else {
                              setMobileMenuOpen(false);
                            }
                          }}
                          onMouseDown={(e) =>
                            ripple(
                              e.nativeEvent,
                              MENU_RIPPLE_COLOR,
                              NAVBAR_RIPPLE_SCALE
                            )
                          }
                        >
                          {item.icon(pathname === item.href)}
                          {/* Primer nivel móvil: usar fuente de heading */}
                          <Text
                            color={
                              pathname === item.href ? "secondary" : "neutral"
                            }
                            colorVariant={
                              pathname === item.href ? "pure" : "text"
                            }
                            weight="medium"
                            size="base"
                            fontType="heading" // Especificar explícitamente que use la fuente de heading
                          >
                            {item.label}
                          </Text>
                          {item.disabled && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                              Próximamente
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
