"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, X, CheckCircle, Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useColorTokens } from "@/hooks/use-color-tokens";
import type {
  InputVariant,
  InputSize,
} from "@/lib/theme/components/input-tokens";
import { Icon } from "@/components/ui/icon";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  error?: string;
  success?: boolean;
  successMessage?: string;
  hint?: string;
  isEditing?: boolean;
  showCharacterCount?: boolean;
  onClear?: () => void;
  variant?: InputVariant;
  size?: InputSize;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leadingIcon,
      trailingIcon,
      error,
      success,
      successMessage,
      hint,
      isEditing,
      showCharacterCount,
      onClear,
      variant = "default",
      size = "md",
      disabled,
      ...props
    },
    ref
  ) => {
    const { component, semantic } = useColorTokens();
    const inputTokens = component.input;
    const variantTokens = inputTokens.variants[variant];
    const sizeTokens = inputTokens.sizes[size];

    const [charCount, setCharCount] = React.useState(
      props.value ? String(props.value).length : 0
    );

    // Estado para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = React.useState(false);

    // Determinar el tipo de input basado en el tipo original y el estado de showPassword
    const inputType = type === "password" && showPassword ? "text" : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    React.useEffect(() => {
      if (props.value !== undefined) {
        setCharCount(String(props.value).length);
      }
    }, [props.value]);

    const getCounterColor = () => {
      if (!props.maxLength) return "text-muted-foreground";
      if (charCount === props.maxLength) return "text-green-500";
      if (charCount > props.maxLength) return "text-red-500";
      if (charCount >= props.maxLength * 0.8) return "text-amber-500";
      return "text-muted-foreground";
    };

    // Mapear tamaños de Input a tamaños de Icon
    const mapInputSizeToIconSize = (inputSize: InputSize) => {
      switch (inputSize) {
        case "sm":
          return "xs";
        case "lg":
          return "md";
        default:
          return "sm"; // md input -> sm icon
      }
    };

    const iconSize = mapInputSizeToIconSize(size);
    const hasLeadingIcon = !!leadingIcon;
    const hasTrailingIcon =
      !!trailingIcon ||
      (props.value && onClear) ||
      !!error ||
      success ||
      type === "password";

    // Definir el padding izquierdo basado en el tamaño del input
    const getLeadingPadding = () => {
      if (!hasLeadingIcon) return "";
      switch (size) {
        case "sm":
          return "pl-7";
        case "lg":
          return "pl-12";
        default:
          return "pl-10"; // md
      }
    };

    // Definir el padding derecho basado en el tamaño del input
    const getTrailingPadding = () => {
      if (!hasTrailingIcon) return "";
      switch (size) {
        case "sm":
          return "pr-7";
        case "lg":
          return "pr-12";
        default:
          return "pr-10"; // md
      }
    };

    // Obtener el color de borde basado en el estado
    const getBorderColor = () => {
      if (disabled) return variantTokens.disabledBorder;
      if (error) return variantTokens.errorBorder;
      if (success) return variantTokens.successBorder;
      return variantTokens.border;
    };

    // Obtener el color de fondo basado en el estado
    const getBackgroundColor = () => {
      if (disabled) return variantTokens.disabledBackground;
      if (error) return variantTokens.errorBackground;
      if (success) return variantTokens.successBackground;
      if (isEditing) return variantTokens.editingBackground;
      return variantTokens.background;
    };

    // Obtener el color del texto basado en el estado
    const getTextColor = () => {
      if (disabled) return variantTokens.disabledText;
      return variantTokens.text;
    };

    // Ajustar la posición del icono según el tamaño
    const getIconLeftPosition = () => {
      switch (size) {
        case "sm":
          return "left-2.5";
        case "lg":
          return "left-4";
        default:
          return "left-3"; // md
      }
    };

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Depuración de valores
    React.useEffect(() => {
      console.log("Input border color:", getBorderColor());
      console.log("Input focus border:", variantTokens.focusBorder);
      console.log("Input semantic primary:", semantic.primary.border);
    }, [variantTokens, semantic]);

    return (
      <div className="w-full">
        <div className="relative w-full">
          <input
            type={inputType}
            className={cn(
              "peer flex w-full rounded-md transition-all",
              sizeTokens.height,
              sizeTokens.fontSize,
              !hasLeadingIcon ? sizeTokens.paddingX : "pr-3",
              sizeTokens.paddingY,
              "border",
              "shadow-[0_0_0_1px_rgba(176,190,217,0.2),0_1px_2px_rgba(176,190,217,0.2)]",
              getLeadingPadding(),
              getTrailingPadding(),
              disabled && "disabled:cursor-not-allowed",
              className
            )}
            style={{
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
              color: getTextColor(),
              // Aplicar estilos de focus directamente
              outline: "none",
              // Usar boxShadow para el efecto de ring
              boxShadow: "none",
            }}
            onFocus={(e) => {
              // Aplicar estilos de focus manualmente
              const target = e.target as HTMLInputElement;
              if (error) {
                target.style.borderColor = variantTokens.errorBorder;
                target.style.boxShadow = `0 0 0 4px ${variantTokens.errorRing}`;
              } else if (success) {
                target.style.borderColor = variantTokens.successBorder;
                target.style.boxShadow = `0 0 0 4px ${variantTokens.successRing}`;
              } else {
                target.style.borderColor = variantTokens.focusBorder;
                target.style.boxShadow = `0 0 0 4px ${variantTokens.focusRing}`;
              }
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              // Restaurar estilos normales
              const target = e.target as HTMLInputElement;
              target.style.borderColor = getBorderColor();
              target.style.boxShadow =
                "0 0 0 1px rgba(176,190,217,0.2), 0 1px 2px rgba(176,190,217,0.2)";
              props.onBlur?.(e);
            }}
            ref={ref}
            onChange={handleChange}
            disabled={disabled}
            autoComplete={props.autoComplete === "on" ? "on" : "new-password"}
            {...props}
          />

          {leadingIcon && (
            <div
              className={`absolute ${getIconLeftPosition()} top-0 h-full flex items-center`}
              style={{
                color: disabled
                  ? variantTokens.disabledText
                  : variantTokens.iconColor,
              }}
            >
              <Icon
                size={iconSize}
                color={
                  disabled
                    ? "neutral"
                    : error
                    ? "danger"
                    : success
                    ? "success"
                    : isEditing
                    ? "tertiary"
                    : "default"
                }
                colorVariant="text"
              >
                {leadingIcon && React.createElement(leadingIcon)}
              </Icon>
            </div>
          )}

          <div className="absolute right-3 top-0 h-full flex items-center gap-2">
            {/* Icono de ojo para contraseñas */}
            {type === "password" && (
              <button
                type="button"
                className="outline-none focus:outline-none"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                <Icon size={iconSize} color="neutral" colorVariant="text">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Icon>
              </button>
            )}

            {/* Botón de limpiar */}
            {props.value && onClear && (
              <button
                type="button"
                className="outline-none focus:outline-none"
                onClick={onClear}
                tabIndex={-1}
              >
                <Icon
                  size={iconSize}
                  color={error ? "danger" : "neutral"}
                  colorVariant="text"
                >
                  <X size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
                </Icon>
              </button>
            )}

            {/* Icono de error/éxito */}
            {(error || success) && (
              <Icon
                size={iconSize}
                color={error ? "danger" : "success"}
                colorVariant="text"
              >
                {error ? (
                  <AlertCircle
                    size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
                  />
                ) : (
                  <CheckCircle
                    size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
                  />
                )}
              </Icon>
            )}

            {/* Icono personalizado */}
            {trailingIcon && !error && !success && (
              <Icon
                size={iconSize}
                color={
                  disabled ? "neutral" : isEditing ? "tertiary" : "default"
                }
                colorVariant="text"
              >
                {React.createElement(trailingIcon, {
                  size: size === "sm" ? 14 : size === "lg" ? 20 : 16,
                })}
              </Icon>
            )}
          </div>
        </div>

        {/* Mostrar contador de caracteres */}
        {showCharacterCount && (
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${getCounterColor()}`}>
              {charCount}
              {props.maxLength && `/${props.maxLength}`}
            </span>
          </div>
        )}

        {/* Mostrar texto de error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5"
            >
              <div className="flex items-center text-red-500 text-sm">
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mostrar mensaje de éxito */}
        <AnimatePresence>
          {success && successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5"
            >
              <div className="flex items-center text-green-500 text-sm">
                <span>{successMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mostrar pista */}
        {hint && !error && !success && (
          <div className="mt-1.5 text-muted-foreground text-sm">{hint}</div>
        )}
      </div>
    );
  }
);

// Definir estilos para padding de iconos
const inputStyles = {
  leadingIconPadding: "pl-10",
  trailingIconPadding: "pr-10",
};

Input.displayName = "Input";
export { Input };
