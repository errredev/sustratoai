"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Navbar } from "@/components/ui/navbar";
import { SolidNavbarWrapper } from "@/components/ui/solid-navbar-wrapper";

export function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Console log para depuración
  console.log("AuthLayoutWrapper - Pathname:", pathname);
  console.log("AuthLayoutWrapper - Usuario:", !!user);
  console.log("AuthLayoutWrapper - Cargando:", loading);

  // Comprobar si estamos en una página de autenticación
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/reset-password" ||
    pathname === "/contact";

  // Log para verificar si se detecta como página de autenticación
  console.log("AuthLayoutWrapper - Es página de auth:", isAuthPage);

  // Esperamos a que la autenticación esté lista antes de mostrar cualquier contenido
  useEffect(() => {
    if (!loading) {
      console.log("AuthLayoutWrapper - useEffect: Autenticación lista");
      if (!user && !isAuthPage) {
        console.log("AuthLayoutWrapper - Redirigiendo a login", {
          user,
          isAuthPage,
        });
        router.push("/login");
      } else {
        console.log("AuthLayoutWrapper - Estableciendo isReady=true");
        setIsReady(true);
      }
    }
  }, [user, loading, isAuthPage, router]);

  // Si estamos cargando o no estamos listos, mostramos una pantalla de carga
  if (loading || !isReady) {
    console.log("AuthLayoutWrapper - Mostrando pantalla de carga", {
      loading,
      isReady,
    });
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si el usuario está autenticado, mostramos la Navbar
  if (user && !isAuthPage) {
    console.log("AuthLayoutWrapper - Mostrando navbar");
    return (
      <>
        <SolidNavbarWrapper>
          <Navbar />
        </SolidNavbarWrapper>
        {children}
      </>
    );
  }

  // Si no está autenticado o estamos en la página de login/signup, solo mostramos el contenido sin Navbar
  console.log("AuthLayoutWrapper - Mostrando solo el contenido sin navbar");
  return <>{children}</>;
}
