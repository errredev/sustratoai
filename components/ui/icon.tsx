"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useColorTokens } from "@/hooks/use-color-tokens";
import type { IconColor, IconSize } from "@/lib/theme/components/icon-tokens";

// Propiedades para el componente Icon
export interface IconProps {
  color?: IconColor;
  colorVariant?: "pure" | "text" | "dark" | "bg";
  size?: IconSize;
  className?: string;
  gradient?: boolean;
  gradientWith?: IconColor;
  gradientColorVariant?: "pure" | "text" | "dark" | "bg";
  strokeOnly?: boolean;
  inverseStroke?: boolean;
  children?: React.ReactNode;
}

/**
 * Componente Icon
 * Renderiza un icono de Lucide con estilos consistentes basados en el sistema de tokens
 */
export function Icon({
  color = "default",
  colorVariant = "text",
  size = "md",
  className,
  gradient = false,
  gradientWith = "accent",
  gradientColorVariant = "text",
  strokeOnly = false,
  inverseStroke,
  children,
  ...props
}: IconProps) {
  const { component } = useColorTokens();
  const iconTokens = component.icon;

  // Si gradient=true y inverseStroke no está definido, lo establecemos como true
  // Esto hace que el gradiente inverso sea el comportamiento predeterminado
  const useInverseStroke = gradient && inverseStroke !== false;

  // Mapeo de tamaños a clases de Tailwind
  const sizeClasses: Record<IconSize, string> = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
    "2xl": "w-12 h-12",
  };

  // Obtener el color del token correspondiente
  const getIconColor = () => {
    if (!iconTokens?.colors) return "currentColor";
    const token = iconTokens.colors[color];
    return token ? token[colorVariant] || token.text : "currentColor";
  };

  // Crear un ID único para el gradiente
  const gradientId = React.useId();
  const strokeGradientId = React.useId();
  const inverseGradientId = React.useId();

  // Obtener colores para el gradiente
  // Para iconos con relleno, usamos "bg" que es más claro como color base
  // Para iconos de solo contorno (strokeOnly), usamos "pure" como color base
  const baseColor = strokeOnly
    ? iconTokens?.colors?.[color]?.pure || "currentColor"
    : iconTokens?.colors?.[color]?.bg || "currentColor";

  // Para el color secundario usamos la variante especificada (por defecto "text")
  const secondColor =
    iconTokens?.colors?.[gradientWith]?.[gradientColorVariant] ||
    "currentColor";

  // Crear un gradiente si se solicita
  const getIconStyle = () => {
    if (!gradient) {
      return { color: getIconColor() };
    }

    if (strokeOnly) {
      return {
        stroke: `url(#${strokeGradientId})`,
        fill: "none", // Aseguramos que no haya relleno
      };
    }

    if (useInverseStroke) {
      return {
        fill: `url(#${gradientId})`,
        stroke: `url(#${inverseGradientId})`, // Usamos el gradiente inverso para el stroke
      };
    }

    return {
      fill: `url(#${gradientId})`,
      stroke: `url(#${gradientId})`,
    };
  };

  return (
    <>
      {gradient && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            {/* Gradiente para relleno */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={baseColor} />
              <stop offset="100%" stopColor={secondColor} />
            </linearGradient>

            {/* Gradiente solo para borde - para strokeOnly usamos pure en lugar de bg */}
            <linearGradient
              id={strokeGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={iconTokens?.colors?.[color]?.pure || "currentColor"}
              />
              <stop offset="100%" stopColor={secondColor} />
            </linearGradient>

            {/* Gradiente inverso para borde cuando se usa inverseStroke */}
            <linearGradient
              id={inverseGradientId}
              x1="100%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor={baseColor} />
              <stop offset="100%" stopColor={secondColor} />
            </linearGradient>
          </defs>
        </svg>
      )}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            className: cn(
              sizeClasses[size],
              className,
              (children as React.ReactElement<any>).props.className
            ),
            style: {
              ...getIconStyle(),
              ...(children as React.ReactElement<any>).props.style,
            },
            ...props,
          })
        : children}
    </>
  );
}

/**
 * Función para crear un componente de icono preconfigurado
 * @param icon El icono de Lucide a utilizar
 * @param defaultProps Propiedades por defecto para el icono
 * @returns Un componente React que renderiza el icono con las propiedades especificadas
 */
export function createIcon(
  IconComponent: React.ComponentType<any>,
  defaultProps: Partial<IconProps> = {}
) {
  const WrappedIcon = (props: Partial<IconProps>) => (
    <Icon {...defaultProps} {...props} />
  );

  WrappedIcon.displayName = `Icon(${IconComponent.displayName || "Icon"})`;
  return WrappedIcon;
}
