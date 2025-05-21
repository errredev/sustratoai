// components/ui/textarea.tsx
// Versión 1.0.0
// Componente TextArea para Sustrato.ai, con tematización dinámica y ARIA.

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
// Iconos para mensajes, si se decide usarlos:
// import { AlertCircle, CheckCircle } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme-provider";
import {
  generateTextareaTokens,
  type TextareaSize,
  type TextareaVariant,
  type TextareaTokens
} from "@/lib/theme/components/textarea-tokens";
// import { Icon } from "@/components/ui/icon"; // Si se usan iconos
import { Text } from "@/components/ui/text";

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "cols"> {
  error?: string;
  success?: boolean;
  successMessage?: string;
  hint?: string;
  isEditing?: boolean;
  showCharacterCount?: boolean;
  variant?: TextareaVariant;
  size?: TextareaSize;
  isRequired?: boolean;
  formFieldHintId?: string;
  formFieldErrorId?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      error,
      success,
      successMessage,
      hint,
      isEditing,
      showCharacterCount,
      variant = "default",
      size = "md",
      disabled,
      id,
      name,
      value,
      onChange,
      maxLength,
      readOnly,
      onFocus,
      onBlur,
      style,
      isRequired,
      formFieldHintId,
      formFieldErrorId,
      rows = 3, 
      ...props
    },
    ref
  ) => {
    const { appColorTokens, mode } = useTheme();
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const charCount = React.useMemo(() => {
      if (value === null || value === undefined) return 0;
      return String(value).length;
    }, [value]);

    const textareaTokens: TextareaTokens | null = React.useMemo(() => {
      if (!appColorTokens || !mode) return null;
      return generateTextareaTokens(appColorTokens, mode);
    }, [appColorTokens, mode]);
    
    React.useEffect(() => {
      const element = textareaRef.current;
      if (element && textareaTokens && appColorTokens) {
        const cvt = textareaTokens.variants[variant];
        
        let effectiveBackgroundColor = cvt.background;
        // El texto del textarea raramente cambia su color principal basado en estos estados,
        // pero el fondo sí puede hacerlo, especialmente para autofill si fuera aplicable.
        // let effectiveTextColor = cvt.text; // No se usa directamente para cambiar --textarea-text aquí

        if (disabled) {
          effectiveBackgroundColor = cvt.disabledBackground;
        } else if (readOnly) {
          effectiveBackgroundColor = cvt.readOnlyBackground;
        } else if (error) {
          effectiveBackgroundColor = cvt.errorBackground; 
        } else if (success) {
          effectiveBackgroundColor = cvt.successBackground;
        } else if (isEditing) {
          effectiveBackgroundColor = cvt.editingBackground;
        }
        
        element.style.setProperty('--textarea-bg', cvt.background);
        element.style.setProperty('--textarea-border', cvt.border);
        element.style.setProperty('--textarea-text', cvt.text);
        element.style.setProperty('--textarea-placeholder', cvt.placeholder);
        
        element.style.setProperty('--textarea-focus-border', cvt.focusBorder);
        element.style.setProperty('--textarea-focus-ring', cvt.focusRing);
        
        element.style.setProperty('--textarea-error-bg', cvt.errorBackground);
        element.style.setProperty('--textarea-error-border', cvt.errorBorder);
        element.style.setProperty('--textarea-error-ring', cvt.errorRing);
        
        element.style.setProperty('--textarea-success-bg', cvt.successBackground);
        element.style.setProperty('--textarea-success-border', cvt.successBorder);
        element.style.setProperty('--textarea-success-ring', cvt.successRing);
        
        element.style.setProperty('--textarea-disabled-bg', cvt.disabledBackground);
        element.style.setProperty('--textarea-disabled-border', cvt.disabledBorder);
        element.style.setProperty('--textarea-disabled-text', cvt.disabledText);
        
        element.style.setProperty('--textarea-readonly-bg', cvt.readOnlyBackground);
        element.style.setProperty('--textarea-readonly-border', cvt.readOnlyBorder);
        element.style.setProperty('--textarea-readonly-text', cvt.readOnlyText);
        
        element.style.setProperty('--textarea-editing-bg', cvt.editingBackground);

        element.style.setProperty('--textarea-autofill-bg', effectiveBackgroundColor);
        // La variable --textarea-text ya se establece con cvt.text, que es el color de texto normal.
        // No se suele cambiar el color del texto principal del textarea con autofill de la misma forma que un input.
      }
    }, [textareaTokens, variant, appColorTokens, disabled, error, success, isEditing, readOnly, id, name]);

    const sizeTokens = textareaTokens ? textareaTokens.sizes[size] : { 
      height: "h-auto", minHeight: "min-h-[80px]", fontSize: "text-sm", paddingX: "px-3", paddingY: "py-2" 
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      // Aquí se podría añadir lógica para auto-resize si se desea en el futuro
    };

    const baseClasses = [
      "peer", "w-full", "rounded-md", "transition-all", "border",
      sizeTokens.height,
      sizeTokens.minHeight,
      sizeTokens.fontSize,
      sizeTokens.paddingX,
      sizeTokens.paddingY,
      "placeholder:text-[var(--textarea-placeholder)]",
      "text-[var(--textarea-text)]",
      "resize-y" // Permitir redimensionamiento vertical, se puede sobreescribir con className (e.g., resize-none)
    ];
    
    const stateClasses: string[] = [];
    if (disabled) { 
      stateClasses.push( 
        "border-[var(--textarea-disabled-border)]", 
        "bg-[var(--textarea-disabled-bg)]", 
        "text-[var(--textarea-disabled-text)]", // Aplicar color de texto deshabilitado
        "cursor-not-allowed", 
        "opacity-70" 
      ); 
    } else if (readOnly) { 
      stateClasses.push( 
        "border-[var(--textarea-readonly-border)]", 
        "bg-[var(--textarea-readonly-bg)]", 
        "text-[var(--textarea-readonly-text)]", // Aplicar color de texto readonly
        "cursor-default", 
        "read-only:focus:outline-none", 
        "read-only:focus:ring-0", 
        "read-only:focus:border-[var(--textarea-readonly-border)]" // Mantener borde readonly en foco
      ); 
    } else if (error) { 
      stateClasses.push(
        "border-[var(--textarea-error-border)]", 
        "bg-[var(--textarea-error-bg)]" // El texto no cambia su color principal con error, solo el borde/fondo.
      ); 
    } else if (success) { 
      stateClasses.push(
        "border-[var(--textarea-success-border)]", 
        "bg-[var(--textarea-success-bg)]" // El texto no cambia su color principal con success.
      ); 
    } else if (isEditing) { 
      stateClasses.push(
        "border-[var(--textarea-border)]", // Borde normal
        "bg-[var(--textarea-editing-bg)]"
      ); 
    } else { 
      stateClasses.push(
        "border-[var(--textarea-border)]", 
        "bg-[var(--textarea-bg)]"
      ); 
    }
    
    const focusClasses: string[] = [];
    if (!disabled && !readOnly) { 
      focusClasses.push("focus:outline-none"); 
      if (error) { 
        focusClasses.push(
          "focus:border-[var(--textarea-error-border)]", 
          "focus:shadow-[0_0_0_3px_var(--textarea-error-ring)]"
        ); 
      } else if (success) { 
        focusClasses.push(
          "focus:border-[var(--textarea-success-border)]", 
          "focus:shadow-[0_0_0_3px_var(--textarea-success-ring)]"
        ); 
      } else { 
        focusClasses.push(
          "focus:border-[var(--textarea-focus-border)]", 
          "focus:shadow-[0_0_0_3px_var(--textarea-focus-ring)]"
        ); 
      } 
    }
    
    const textareaClasses = cn(...baseClasses, ...stateClasses, ...focusClasses, className);
    
    const errorMsgId = id && error ? `${id}-error-message` : undefined;
    const successMsgId = id && success && !error && successMessage ? `${id}-success-message` : undefined;
    const hintMsgId = id && hint && !error && !success ? `${id}-hint-message` : undefined; 

    const describedByArray = [];
    if (errorMsgId) describedByArray.push(errorMsgId);
    if (successMsgId) describedByArray.push(successMsgId);
    if (hintMsgId) describedByArray.push(hintMsgId);
    if (formFieldErrorId) describedByArray.push(formFieldErrorId);
    if (formFieldHintId) describedByArray.push(formFieldHintId);
    const ariaDescribedBy = describedByArray.length > 0 ? describedByArray.join(" ") : undefined;

    return (
      <div className="w-full">
        <textarea
          id={id}
          name={name}
          className={textareaClasses}
          ref={textareaRef}
          value={value ?? ""}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          maxLength={maxLength}
          readOnly={readOnly}
          style={style}
          rows={rows}
          aria-invalid={!!error}
          aria-required={isRequired}
          aria-describedby={ariaDescribedBy}
          {...props}
        />
        <div className="mt-1.5 flex justify-between items-start min-h-[1.25em]">
          <div className="flex-grow pr-2">
            <AnimatePresence>
              {error && (
                <motion.div id={errorMsgId} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  <Text color="danger" colorVariant="pure" size="sm" className="flex items-center">
                    {error}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {success && !error && successMessage && (
                <motion.div id={successMsgId} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  <Text color="success" colorVariant="pure" size="sm" className="flex items-center">
                    {successMessage}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
            {hint && !error && !success && !disabled && !readOnly && (
              <div id={hintMsgId} className="text-sm opacity-70 text-[var(--textarea-text)]">
                {hint}
              </div>
            )}
          </div>
          {showCharacterCount && maxLength && maxLength > 0 && !disabled && !readOnly && (
            <div className="flex-shrink-0">
              <Text
                size="xs"
                color={error && appColorTokens ? "danger" : "neutral"}
                colorVariant={error && appColorTokens ? "pure" : "textShade"}
                className="opacity-70"
              >
                {charCount}/{maxLength}
              </Text>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
export { TextArea };