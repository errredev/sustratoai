"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/theme-provider";
import {
  generatePageBackgroundTokens,
  type PageBackgroundVariant,
} from "@/lib/theme/components/page-background-tokens";

interface PageBackgroundProps {
  children: React.ReactNode;
  variant?: PageBackgroundVariant;
  className?: string;
}

export function PageBackground({
  children,
  variant = "minimal",
  className = "",
}: PageBackgroundProps) {
  const { appColorTokens, mode } = useTheme();
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Generar tokens para el fondo según la variante, appColorTokens y modo
    const tokens = generatePageBackgroundTokens(appColorTokens, mode, variant);

    // Aplicar los tokens como estilos
    setStyle({
      backgroundColor: tokens.background,
      backgroundImage: tokens.backgroundImage,
    });
  }, [appColorTokens, mode, variant]);

  // Aplicar clases para asegurar que cubra toda la pantalla
  const baseClasses = `fixed inset-0 w-full h-full min-h-screen overflow-auto ${
    mode === "dark" ? "dark" : ""
  } ${className}`;

  // Altura del Navbar (ejemplo, idealmente de una variable CSS o token)
  const navbarHeight = "4rem"; // TODO: Reemplazar con una variable CSS como 'var(--navbar-height)' o un token

  return (
    // Añadimos display: flex y flex-direction: column al div principal
    // para que el espaciador y el children se apilen verticalmente.
    // El overflow-auto se mantiene aquí para el scroll del contenido.
    <div className={`${baseClasses} flex flex-col`} style={style}>
      {/* Div espaciador para el Navbar */}
      <div style={{ height: navbarHeight, flexShrink: 0 }} />
      {/* Contenedor para el contenido principal, que ahora será el que haga scroll si es necesario */}
      {/* Se podría añadir 'flex-grow: 1' y 'overflow-y: auto' aquí si el scroll solo debe afectar al children */}
      {/* pero mantener el overflow-auto en el padre es más simple si el fondo no necesita ser estático durante el scroll del children*/}
      {children}
    </div>
  );
}
