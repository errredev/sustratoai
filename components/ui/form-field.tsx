// components/ui/form-field.tsx
"use client";

import * as React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { Text } from "./text";
import type { TextProps } from "./text";

type TextColor = TextProps["color"];
type TextColorVariant = TextProps["colorVariant"];


export interface FormFieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
  isRequired?: boolean;
}

export function FormField({
  label,
  htmlFor,
  className,
  children,
  hint,
  error, // Este es el error de FormField
  isRequired,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const formFieldWrapperId = `form-field-wrapper-${htmlFor}`;

  React.useEffect(() => {
    const formFieldDiv = document.getElementById(formFieldWrapperId);
    if (!formFieldDiv) {
      // console.warn(`FormField: Wrapper div con id "${formFieldWrapperId}" no encontrado.`);
      return;
    }

    const handleFocusIn = (event: FocusEvent) => {
      console.log(`FormField [${htmlFor}] focusin. Target:`, event.target); // LOG
      // Verificamos si el elemento que recibió foco o uno de sus padres cercanos es un input, textarea, select, o nuestro combobox
      if (event.target && (event.target as HTMLElement).closest('input, textarea, select, [role="combobox"]')) {
        setIsFocused(true);
      }
    };
    const handleFocusOut = (event: FocusEvent) => {
      console.log(`FormField [${htmlFor}] focusout. RelatedTarget (nuevo foco):`, event.relatedTarget); // LOG
      // Si el nuevo elemento enfocado NO está dentro de ESTE FormField, entonces perdemos el foco.
      if (!formFieldDiv.contains(event.relatedTarget as Node)) {
          setIsFocused(false);
      }
    };

    formFieldDiv.addEventListener('focusin', handleFocusIn);
    formFieldDiv.addEventListener('focusout', handleFocusOut);

    return () => {
      formFieldDiv.removeEventListener('focusin', handleFocusIn);
      formFieldDiv.removeEventListener('focusout', handleFocusOut);
    };
  }, [htmlFor, formFieldWrapperId]); // formFieldWrapperId es constante si htmlFor lo es

  let labelTextColor: TextColor = "neutral";
  let labelTextVariant: TextColorVariant | undefined = "text";

  if (error) { 
    labelTextColor = "danger";
    labelTextVariant = "pure";
  } else if (isFocused) {
    labelTextColor = "primary";
    labelTextVariant = "pure";
  }

  const formFieldGeneratedHintId = hint ? `${htmlFor}-formfield-hint` : undefined;
  const formFieldGeneratedErrorId = error ? `${htmlFor}-formfield-error` : undefined;

  return (
    <div id={formFieldWrapperId} className={cn("space-y-1.5", className)}>
      <div>
        <Label htmlFor={htmlFor}>
          <Text
            variant="label"
            color={labelTextColor}
            colorVariant={labelTextVariant}
            className="transition-colors duration-200"
          >
            {label}
            {isRequired && (
              <span className="text-danger-pure ml-0.5 select-none">*</span>
            )}
          </Text>
        </Label>
      </div>
      
      {children}

      {hint && !error && (
        <Text
          id={formFieldGeneratedHintId}
          variant="caption"
          color="neutral"
          colorVariant="textShade"
          className="mt-1"
        >
          {hint}
        </Text>
      )}
      {error && ( // Este es el mensaje de error de FormField
        <Text
          id={formFieldGeneratedErrorId}
          variant="caption"
          color="danger"
          colorVariant="pure"
          className="mt-1"
        >
          {error}
        </Text>
      )}
    </div>
  );
}