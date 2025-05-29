"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/database.types";

// Crear un cliente de Supabase para el navegador con configuración mejorada
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: {
          getItem: (key: string) => {
            if (typeof window === 'undefined') return null;
            return localStorage.getItem(key);
          },
          setItem: (key: string, value: string) => {
            if (typeof window === 'undefined') return;
            localStorage.setItem(key, value);
          },
          removeItem: (key: string) => {
            if (typeof window === 'undefined') return;
            localStorage.removeItem(key);
          },
        },
        storageKey: 'sb-auth-token',
      },
      cookieOptions: {
        name: 'sb-auth-token',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        domain: '',
        path: '/',
        sameSite: 'lax'
      }
    }
  );
}

// Iniciar sesión con email y contraseña
export async function signInWithEmail(email: string, password: string) {
  const supabase = createBrowserSupabaseClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error de autenticación:', error);
      return { 
        data: null,
        error: {
          message: error.message || 'Error al iniciar sesión',
          status: error.status || 400
        }
      };
    }


    return { data, error: null };
  } catch (error) {
    console.error('Error inesperado en signInWithEmail:', error);
    return {
      data: null,
      error: {
        message: 'Error inesperado al intentar iniciar sesión',
        status: 500
      }
    };
  }
}

// Cerrar sesión
export async function signOut() {
  const supabase = createBrowserSupabaseClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    
    // Limpiar almacenamiento local relacionado con la sesión
    if (typeof window !== 'undefined') {
      localStorage.removeItem('proyectoActualId');
      sessionStorage.clear();
    }
    
    // Forzar una recarga completa para limpiar el estado
    if (!error) {
      window.location.href = "/login";
    }
    
    return { error };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { error: { message: 'Error al cerrar sesión', status: 500 } };
  }
}

// Registrar un nuevo usuario
export async function signUp(email: string, password: string) {
  const supabase = createBrowserSupabaseClient();
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error en el registro:', error);
      return { 
        data: null,
        error: {
          message: error.message || 'Error al registrar el usuario',
          status: error.status || 400
        }
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error inesperado en signUp:', error);
    return {
      data: null,
      error: {
        message: 'Error inesperado al registrar el usuario',
        status: 500
      }
    };
  }
}

// Obtener la sesión actual
export async function getSession() {
  const supabase = createBrowserSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error al obtener la sesión:', error);
    return { session: null, error };
  }
  
  return { session, error: null };
}
