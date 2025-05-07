"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signIn, signOut, getSession, supabaseClient } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: any;
    success: boolean;
  }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    error: any;
    success: boolean;
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const { data, error } = await getSession();

        if (error) {
          console.error("Error al cargar la sesión:", error);
          return;
        }

        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error inesperado al cargar la sesión:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    // Suscribirse a cambios en el estado de autenticación
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirigir según el estado de autenticación
  useEffect(() => {
    if (loading) return;

    // Debug: Imprimir la ruta actual y el estado de autenticación
    console.log("Auth Debug - Ruta actual:", pathname);
    console.log("Auth Debug - Usuario autenticado:", !!user);

    // Verificación más flexible para las páginas de autenticación
    const isExactAuthPage =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/reset-password" ||
      pathname === "/contact";

    // Verificación alternativa utilizando startsWith para cada ruta
    const isAuthPage =
      isExactAuthPage ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/contact");

    console.log("Auth Debug - Es página de auth exacta:", isExactAuthPage);
    console.log("Auth Debug - Es página de auth (flexible):", isAuthPage);
    console.log("Auth Debug - Pathname exacto:", pathname);

    if (!user && !isAuthPage) {
      console.log(
        "Auth Debug - Redirigiendo a login porque no hay usuario y no es página de auth"
      );
      router.push("/login");
    } else if (user && isAuthPage) {
      console.log(
        "Auth Debug - Redirigiendo a home porque hay usuario y es página de auth"
      );
      router.push("/");
    } else {
      console.log("Auth Debug - No se requiere redirección");
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        return { error, success: false };
      }
      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        return { error, success: false };
      }
      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  const logout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn: login,
        signUp: signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
