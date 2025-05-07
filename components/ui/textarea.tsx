"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useColorTokens } from "@/hooks/use-color-tokens"
import type { InputSize, InputVariant } from "@/lib/theme/components/input-tokens"
import { Icon } from "./icon"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  hint?: string
  isEditing?: boolean
  showCharacterCount?: boolean
  size?: InputSize
  variant?: InputVariant
  isSuccess?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error, hint, isEditing, showCharacterCount, size = "md", variant = "default", isSuccess, ...props },
    ref,
  ) => {
    const [charCount, setCharCount] = React.useState(props.value ? String(props.value).length : 0)
    const { component } = useColorTokens()
    const inputTokens = component.input
    const variantTokens = inputTokens.variants[variant]
    const sizeTokens = inputTokens.sizes[size]

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      props.onChange?.(e)
    }

    React.useEffect(() => {
      if (props.value !== undefined) {
        setCharCount(String(props.value).length)
      }
    }, [props.value])

    const getCounterColor = () => {
      if (!props.maxLength) return "text-muted-foreground"
      if (charCount === props.maxLength) return "text-green-500"
      if (charCount > props.maxLength) return "text-red-500"
      if (charCount >= props.maxLength * 0.8) return "text-amber-500"
      return "text-muted-foreground"
    }

    // Mapear tamaños de Input a tamaños de Icon
    const mapInputSizeToIconSize = (inputSize: InputSize) => {
      switch (inputSize) {
        case "sm":
          return "xs"
        case "lg":
          return "md"
        default:
          return "sm" // md input -> sm icon
      }
    }

    const iconSize = mapInputSizeToIconSize(size)

    // Obtener el color de fondo basado en el estado
    const getBackgroundColor = () => {
      if (props.disabled) return variantTokens.disabledBackground
      if (error) return variantTokens.errorBackground
      if (isSuccess) return variantTokens.successBackground
      if (isEditing) return variantTokens.editingBackground
      return variantTokens.background
    }

    return (
      <div className="w-full">
        <div className="relative w-full">
          <textarea
            className={cn(
              "peer",
              "flex w-full min-h-[80px] rounded-md px-3 py-2 transition-all",
              "border shadow-sm",
              "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
              "focus:outline-none focus:ring-4",
              "shadow-[0_0_0_1px_rgba(176,190,217,0.2),0_1px_2px_rgba(176,190,217,0.2)]",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : isSuccess
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : "border-[#d0d5dd] focus:border-primary focus:ring-primary/20",
              sizeTokens.fontSize,
              className,
            )}
            ref={ref}
            onChange={handleChange}
            style={{ backgroundColor: getBackgroundColor() }}
            {...props}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                key="textarea-error-icon"
                className="absolute right-3 top-3"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Icon icon={AlertCircle} size={iconSize} color="danger" />
              </motion.div>
            )}
            {isSuccess && !error && (
              <motion.div
                key="textarea-success-icon"
                className="absolute right-3 top-3"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Icon icon={CheckCircle} size={iconSize} color="success" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-1.5 flex justify-between text-xs">
          <div
            className={cn("text-xs")}
            style={{
              color: error
                ? variantTokens.errorBorder
                : isSuccess
                  ? variantTokens.successText
                  : variantTokens.placeholder,
            }}
          >
            {error || hint}
          </div>

          {showCharacterCount && props.maxLength && (
            <div className={cn("ml-auto text-xs", getCounterColor())}>
              {charCount}/{props.maxLength}
            </div>
          )}
        </div>
      </div>
    )
  },
)

Textarea.displayName = "Textarea"
export { Textarea }
