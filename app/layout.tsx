import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar";
import { SolidNavbarWrapper } from "@/components/ui/solid-navbar-wrapper";
import { Providers } from "./providers";
import { FontThemeProvider } from "./font-provider";
import { getAllFontVariables } from "@/lib/fonts";
import { AuthLayoutWrapper } from "./auth-layout-wrapper";

export const metadata: Metadata = {
  title: "Sustrato.ai",
  description: "Plataforma de investigación cualitativa",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Usar la función centralizada para obtener todas las variables de fuentes
  const fontVariables = getAllFontVariables();

  return (
    <html lang="es" suppressHydrationWarning className={fontVariables}>
      <body>
        <Providers>
          <FontThemeProvider>
            <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
          </FontThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
