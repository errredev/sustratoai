"use client"

import { cn } from "@/lib/utils"
import type { DividerSize, DividerVariant } from "@/lib/theme/components/divider-tokens"
import type { HTMLAttributes } from "react"
import { useColorTokens } from "@/hooks/use-color-tokens"

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: DividerVariant
  size?: DividerSize
  className?: string
}

export function Divider({ variant = "gradient", size = "md", className, ...props }: DividerProps) {
  // Usar el hook useColorTokens para asegurar que los tokens se actualicen con el tema
  const { component } = useColorTokens()

  // Obtener los tokens del divider
  const dividerTokens = component?.divider

  // Si no hay tokens disponibles, renderizar un divider básico
  if (!dividerTokens) {
    return <div className={cn("h-0.5 w-16 bg-primary rounded-full mx-auto", className)} {...props} />
  }

  // Obtener los estilos según la variante y tamaño
  const variantStyle = dividerTokens.variants[variant]
  const sizeStyle = dividerTokens.sizes[size]

  // Crear el estilo en línea para el divider
  const style = {
    height: sizeStyle.height,
    width: sizeStyle.width,
    borderRadius: sizeStyle.borderRadius,
    ...(variant === "gradient"
      ? { backgroundImage: variantStyle.backgroundImage }
      : { background: variantStyle.background }),
  }

  return <div className={cn("mx-auto", className)} style={style} {...props} />
}
