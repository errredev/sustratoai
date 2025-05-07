"use client";

import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useColorTokens } from "@/hooks/use-color-tokens";
import type { ProCardVariant } from "@/lib/theme/color-tokens";
import { Text } from "@/components/ui/text";
import type { FontPairType } from "@/components/ui/text";

export type ProCardBorderStyle = "none" | "normal" | "top" | "left";

export interface ProCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ProCardVariant;
  border?: ProCardBorderStyle;
  borderVariant?: ProCardVariant;
  selected?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Subcomponentes
interface ProCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

interface ProCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children?: React.ReactNode;
  variant?: string;
  size?: string;
  color?: string;
  colorVariant?: string;
  gradient?: boolean | string;
  fontType?: FontPairType;
  weight?: string;
}

interface ProCardSubtitleProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children?: React.ReactNode;
  variant?: string;
  size?: string;
  color?: string;
  colorVariant?: string;
  gradient?: boolean | string;
  fontType?: FontPairType;
  weight?: string;
}

interface ProCardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

interface ProCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

interface ProCardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

interface ProCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

// Componente principal
const ProCard = forwardRef<HTMLDivElement, ProCardProps>(
  (
    {
      variant = "primary",
      border = "none",
      borderVariant,
      selected = false,
      loading = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const actualBorderVariant = borderVariant || variant;
    const tokens = useColorTokens();
    const hasTokens = tokens?.component?.proCard;
    const selectedClass = selected ? "ring-2" : "";
    const selectedStyle =
      selected && hasTokens
        ? { ringColor: tokens.component.proCard.selected }
        : {};
    const loadingClass = loading ? "animate-pulse" : "";

    const loadingContent = (
      <div className="flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );

    const defaultBackground = "bg-white dark:bg-gray-800";
    const defaultBorder = "border-gray-200 dark:border-gray-700";
    const defaultGradient = "linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%)";
    const defaultBorderGradient =
      "linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 100%)";

    const renderContent = () => (
      <div
        className={cn(
          "rounded-lg p-4 transition-all duration-200",
          !hasTokens && defaultBackground,
          selectedClass,
          loadingClass,
          className
        )}
        style={{
          background: hasTokens
            ? tokens.component.proCard.backgroundGradient[variant]
            : defaultGradient,
          ...selectedStyle,
        }}
      >
        {loading ? loadingContent : children}
      </div>
    );

    if (border === "top") {
      return (
        <div ref={ref} className="relative" {...props}>
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-lg z-10"
            style={{
              backgroundImage: hasTokens
                ? tokens.component.proCard.borderGradientTop[
                    actualBorderVariant
                  ]
                : defaultBorderGradient,
            }}
          />
          {renderContent()}
        </div>
      );
    }

    if (border === "left") {
      return (
        <div ref={ref} className="relative" {...props}>
          <div
            className="absolute top-0 left-0 bottom-0 w-2 rounded-l-lg z-10"
            style={{
              backgroundImage: hasTokens
                ? tokens.component.proCard.borderGradientLeft[
                    actualBorderVariant
                  ]
                : defaultBorderGradient,
            }}
          />
          {renderContent()}
        </div>
      );
    }

    if (border === "normal") {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-lg p-4 transition-all duration-200 border",
            !hasTokens && defaultBackground,
            !hasTokens && defaultBorder,
            selectedClass,
            loadingClass,
            className
          )}
          style={{
            background: hasTokens
              ? tokens.component.proCard.backgroundGradient[variant]
              : defaultGradient,
            borderColor: hasTokens
              ? tokens.component.proCard.border[actualBorderVariant]
              : undefined,
            ...selectedStyle,
          }}
          {...props}
        >
          {loading ? loadingContent : children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg p-4 transition-all duration-200",
          !hasTokens && defaultBackground,
          selectedClass,
          loadingClass,
          className
        )}
        style={{
          background: hasTokens
            ? tokens.component.proCard.backgroundGradient[variant]
            : defaultGradient,
          ...selectedStyle,
        }}
        {...props}
      >
        {loading ? loadingContent : children}
      </div>
    );
  }
);

ProCard.displayName = "ProCard";

// Subcomponentes
const Header = forwardRef<HTMLDivElement, ProCardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  )
);

const Title = forwardRef<HTMLHeadingElement, ProCardTitleProps>(
  (
    {
      children,
      className,
      variant = "heading",
      size = "xl",
      color,
      colorVariant,
      gradient,
      fontType,
      weight,
      ...props
    },
    ref
  ) => (
    <div ref={ref} {...props}>
      <Text
        variant={variant}
        size={size}
        color={color}
        colorVariant={colorVariant}
        gradient={gradient}
        fontType={fontType}
        weight={weight}
        className={className}
      >
        {children}
      </Text>
    </div>
  )
);

const Subtitle = forwardRef<HTMLParagraphElement, ProCardSubtitleProps>(
  (
    {
      children,
      className,
      variant = "default",
      size = "sm",
      color = "neutral",
      colorVariant = "muted",
      gradient,
      fontType,
      weight,
      ...props
    },
    ref
  ) => (
    <div ref={ref} {...props}>
      <Text
        variant={variant}
        size={size}
        color={color}
        colorVariant={colorVariant}
        gradient={gradient}
        fontType={fontType}
        weight={weight}
        className={className}
      >
        {children}
      </Text>
    </div>
  )
);

const Media = forwardRef<HTMLDivElement, ProCardMediaProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  )
);

const Content = forwardRef<HTMLDivElement, ProCardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  )
);

const Actions = forwardRef<HTMLDivElement, ProCardActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  )
);

const Footer = forwardRef<HTMLDivElement, ProCardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  )
);

// Asignar nombres a los componentes
Header.displayName = "ProCard.Header";
Title.displayName = "ProCard.Title";
Subtitle.displayName = "ProCard.Subtitle";
Media.displayName = "ProCard.Media";
Content.displayName = "ProCard.Content";
Actions.displayName = "ProCard.Actions";
Footer.displayName = "ProCard.Footer";

// Crear un tipo para el componente ProCard con sus subcomponentes
interface ProCardComponent
  extends React.ForwardRefExoticComponent<
    ProCardProps & React.RefAttributes<HTMLDivElement>
  > {
  Header: typeof Header;
  Title: typeof Title;
  Subtitle: typeof Subtitle;
  Media: typeof Media;
  Content: typeof Content;
  Actions: typeof Actions;
  Footer: typeof Footer;
}

// Exportar el componente principal con sus subcomponentes
const ProCardWithSubcomponents = ProCard as ProCardComponent;
ProCardWithSubcomponents.Header = Header;
ProCardWithSubcomponents.Title = Title;
ProCardWithSubcomponents.Subtitle = Subtitle;
ProCardWithSubcomponents.Media = Media;
ProCardWithSubcomponents.Content = Content;
ProCardWithSubcomponents.Actions = Actions;
ProCardWithSubcomponents.Footer = Footer;

export { ProCardWithSubcomponents as ProCard };
