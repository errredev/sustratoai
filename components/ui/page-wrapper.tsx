"use client"

import type { ReactNode } from "react"
import { PageBackground } from "./page-background"
import type { PageBackgroundVariant } from "@/lib/theme/components/page-background-tokens"

interface PageWrapperProps {
  children: ReactNode
  title?: string
  variant?: PageBackgroundVariant
  className?: string
}

export function PageWrapper({ children, variant = "default", className = "" }: PageWrapperProps) {
  return (
    <PageBackground variant={variant} className={className}>
      <div className="min-h-[calc(100vh-12rem)] w-full">{children}</div>
    </PageBackground>
  )
}
