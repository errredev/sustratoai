// --- layout.tsx (MODIFICADO LIGERAMENTE O DEJAR COMO ESTÁ SI AuthLayoutWrapper SE ENCARGA) ---
import React, { Suspense } from "react";
import "./globals.css";
import type { Metadata } from "next";
// Navbar y SolidNavbarWrapper NO SE IMPORTAN AQUÍ si AuthLayoutWrapper los maneja
import { Providers } from "./providers";
import { getAllFontVariables } from "@/lib/fonts";
import { AuthLayoutWrapper } from "./auth-layout-wrapper"; // Este es el clave
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo"; // Import the logo

export const metadata: Metadata = {
  /* ... */
};

// Simple component for the loading fallback
const GlobalLoadingIndicator = () => (
  <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
    <SustratoLoadingLogo
      size={96}
      variant="spin-pulse"
      speed="fast"
      breathingEffect
      colorTransition
    />{" "}
    {/* Customize as needed */}
  </div>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVariables = getAllFontVariables();

  return (
    <html lang="es" suppressHydrationWarning className={fontVariables}>
      {/* El body debería permitir que los hijos determinen su altura y el scroll */}
      {/* Añade 'h-full' si quieres que html y body usen toda la altura disponible */}
      {/* y 'flex flex-col' en #__next si el layout principal es flex */}
      <body className="h-full">
        <Providers>
          <AuthLayoutWrapper>
            <Suspense fallback={<GlobalLoadingIndicator />}>
              {children}
            </Suspense>
          </AuthLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
