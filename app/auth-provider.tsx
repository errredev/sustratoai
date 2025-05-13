"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signIn, signOut, getSession, supabaseClient } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { obtenerProyectosUsuario, obtenerProyectoPorId, type Proyecto } from "@/app/actions/proyecto-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authInitialized: boolean; // Nuevo estado para indicar que la autenticación se ha inicializado
  proyectoActual: Proyecto | null;
  proyectosDisponibles: Proyecto[];
  cargandoProyectos: boolean;
  seleccionarProyecto: (proyectoId: string) => Promise<void>;
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
  const [authInitialized, setAuthInitialized] = useState(false);
  const [proyectoActual, setProyectoActual] = useState<Proyecto | null>(null);
  const [proyectosDisponibles, setProyectosDisponibles] = useState<Proyecto[]>([]);
  const [cargandoProyectos, setCargandoProyectos] = useState(false);
  const [mostrarSelectorProyecto, setMostrarSelectorProyecto] = useState(false);
  
  // Referencias para controlar estados y evitar operaciones duplicadas
  const authStateProcessed = useRef(false);
  const proyectosCargados = useRef(false);
  const processingAuthEvent = useRef(false);

  // Función para cargar los proyectos del usuario con mejor manejo de errores y debugging
  const cargarProyectosUsuario = async (userId: string) => {
    // Verificación de parámetros y estado
    if (!userId) {
      console.error("❌ Error: Se intentó cargar proyectos sin ID de usuario");
      return;
    }
    
    // Verificar si ya estamos cargando proyectos o si ya se cargaron
    if (cargandoProyectos) {
      console.log("⏳ Carga de proyectos ya en progreso, omitiendo llamada redundante");
      return;
    }
    
    if (proyectosCargados.current && proyectosDisponibles.length > 0) {
      console.log("✅ Proyectos ya cargados, usando datos existentes");
      return;
    }
    
    // ID único para seguimiento de logs
    const operationId = Math.floor(Math.random() * 1000);
    console.log(`🔍 [${operationId}] Iniciando carga de proyectos para: ${userId.substring(0, 8)}...`);
    
    setCargandoProyectos(true);
    
    try {
      // Forzar llamada a servidor incluso si hay llamadas anteriores (puede ser necesario después de login)
      proyectosCargados.current = false;
      
      // Llamada al servidor - acción de proyecto
      console.log(`📡 [${operationId}] Llamando a API obtenerProyectosUsuario...`);
      const resultado = await obtenerProyectosUsuario(userId);
      
      // Verificar si el usuario cambió durante la carga
      if (session?.user?.id !== userId) {
        console.log(`⚠️ [${operationId}] Usuario cambió durante carga, abortando procesamiento`);
        setCargandoProyectos(false);
        return;
      }
      
      // Procesar resultados de la API
      if (resultado.success && resultado.data) {
        console.log(`✅ [${operationId}] API retornó ${resultado.data.length} proyectos`);
        setProyectosDisponibles(resultado.data);
        
        // Verificar proyecto guardado en localStorage
        const proyectoGuardadoId = localStorage.getItem('proyectoActualId');
        console.log(`🔍 [${operationId}] Proyecto guardado: ${proyectoGuardadoId || 'ninguno'}`);  
        
        if (proyectoGuardadoId) {
          // Buscar proyecto guardado entre los disponibles
          const proyectoEncontrado = resultado.data.find(p => p.id === proyectoGuardadoId);
          
          if (proyectoEncontrado) {
            console.log(`✅ [${operationId}] Proyecto encontrado y seleccionado: ${proyectoEncontrado.nombre}`);
            setProyectoActual(proyectoEncontrado);
          } else if (resultado.data.length > 0) {
            console.log(`⚠️ [${operationId}] Proyecto guardado no encontrado, mostrando selector`);
            setMostrarSelectorProyecto(true);
          }
        } else if (resultado.data.length === 1) {
          // Auto-seleccionar único proyecto
          console.log(`✅ [${operationId}] Auto-seleccionando único proyecto: ${resultado.data[0].nombre}`);
          setProyectoActual(resultado.data[0]);
          localStorage.setItem('proyectoActualId', resultado.data[0].id);
        } else if (resultado.data.length > 1) {
          // Mostrar selector para múltiples proyectos
          console.log(`🔄 [${operationId}] Mostrando selector para ${resultado.data.length} proyectos`);
          setMostrarSelectorProyecto(true);
        } else {
          console.log(`⚠️ [${operationId}] No se encontraron proyectos para el usuario`);
        }
        
        // Marcar operación como completada
        proyectosCargados.current = true;
      } else {
        // Manejar error de la API - verificamos que es un resultado con error
        if ('error' in resultado) {
          console.error(`❌ [${operationId}] Error retornado por API:`, resultado.error);
        } else {
          console.error(`❌ [${operationId}] API retornó estado error sin mensaje de error`);
        }
        setProyectosDisponibles([]);
      }
    } catch (error) {
      console.error(`❌ [${operationId}] Excepción al cargar proyectos:`, error);
      setProyectosDisponibles([]);
      proyectosCargados.current = false;
    } finally {
      setCargandoProyectos(false);
    }
  };
  
  // Función para seleccionar un proyecto
  const seleccionarProyecto = async (proyectoId: string) => {
    try {
      const resultado = await obtenerProyectoPorId(proyectoId);
      
      if (resultado.success && resultado.data) {
        setProyectoActual(resultado.data);
        localStorage.setItem('proyectoActualId', proyectoId);
        setMostrarSelectorProyecto(false);
      }
    } catch (error) {
      console.error("Error al seleccionar proyecto:", error);
    }
  };

  // Función mejorada para cargar la sesión inicial
  const loadSession = async () => {
    // Evitar inicializaciones redundantes
    if (authStateProcessed.current) {
      console.log("⏳ Omitiendo carga de sesión - ya procesada");
      return;
    }
    
    try {
      // Marcamos que estamos procesando para evitar operaciones en paralelo
      authStateProcessed.current = true;
      
      const { data, error } = await getSession();
      if (error) throw error;

      if (data.session) {
        console.log("✅ Sesión activa:", data.session.user.id.substring(0, 8) + "...");
        setUser(data.session.user);
        setSession(data.session);
        await cargarProyectosUsuario(data.session.user.id);
      } else {
        console.log("❌ Sin sesión activa");
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error("❌ Error obteniendo sesión:", error);
      authStateProcessed.current = false; // Permitir reintento en caso de error
    } finally {
      setLoading(false);
      setAuthInitialized(true);
    }
  };

  // Inicializar AuthProvider una sola vez al cargar
  useEffect(() => {
    if (!authInitialized && !authStateProcessed.current) {
      console.log("🔄 Inicializando AuthProvider");
      loadSession();
    }
  }, [authInitialized]);

  // Manejar eventos de autenticación de forma unificada
  useEffect(() => {
    // Evitar suscribirse múltiples veces al mismo evento
    let isMounted = true;
    let isProcessingEvent = false;
    
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, newSession) => {
      // Evitar procesamiento de eventos mientras otro está en progreso
      if (isProcessingEvent || processingAuthEvent.current || !isMounted) return;
      
      try {
        isProcessingEvent = true;
        processingAuthEvent.current = true;
        
        // Registrar el evento con ID corto para facilitar depuración
        const eventId = Math.floor(Math.random() * 1000);
        console.log(`🔄 [${eventId}] Evento auth: ${event}`);
        
        // SIGNED_IN (login exitoso)
        if (event === "SIGNED_IN" && newSession) {
          // Actualizamos el estado con el nuevo usuario autenticado
          if (!user || user.id !== newSession.user.id) {
            console.log(`✅ [${eventId}] Usuario autenticado: ${newSession.user.id.substring(0, 8)}...`);
            setUser(newSession.user);
            setSession(newSession);
            
            // IMPORTANTE: Cargar proyectos en cada inicio de sesión exitoso
            // Forzar recarga incluso si se ha intentado antes
            console.log(`🔄 [${eventId}] Cargando proyectos tras login exitoso`);
            proyectosCargados.current = false; // Restablecer para forzar nueva carga
            
            try {
              // Realizar múltiples intentos con retardo entre ellos si es necesario
              let intentos = 0;
              let proyectosCargadosExitosamente = false;
              
              while (intentos < 3 && !proyectosCargadosExitosamente) {
                intentos++;
                console.log(`🔄 [${eventId}] Intento ${intentos} de cargar proyectos`);
                
                try {
                  await cargarProyectosUsuario(newSession.user.id);
                  // Verificar si realmente se cargaron proyectos o no
                  proyectosCargadosExitosamente = proyectosCargados.current;
                  
                  if (!proyectosCargadosExitosamente && intentos < 3) {
                    // Esperar un poco antes del siguiente intento (0.5 segundos)
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }
                } catch (error) {
                  console.error(`❌ [${eventId}] Error en intento ${intentos}:`, error);
                  if (intentos < 3) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }
                }
              }
              
              if (!proyectosCargadosExitosamente) {
                console.error(`❌ [${eventId}] No se pudieron cargar proyectos después de ${intentos} intentos`);
              }
            } catch (error) {
              console.error(`❌ [${eventId}] Error general al cargar proyectos:`, error);
            }
          }
        }
        // SIGNED_OUT (logout exitoso)
        else if (event === "SIGNED_OUT") {
          console.log(`🔒 [${eventId}] Sesión cerrada`);
          setUser(null);
          setSession(null);
          setProyectoActual(null);
          setProyectosDisponibles([]);
          proyectosCargados.current = false;
        }
        // La primera carga de la sesión
        else if (event === "INITIAL_SESSION" && newSession) {
          console.log(`🔄 [${eventId}] Estado inicial con sesión detectada`);
          
          // Solo actuar si tenemos una sesión válida
          if (!user && newSession?.user) {
            console.log(`🔄 [${eventId}] Estableciendo usuario de sesión inicial`);
            setUser(newSession.user);
            setSession(newSession);
            
            // Forzar carga de proyectos si es necesario
            if (!proyectosCargados.current || proyectosDisponibles.length === 0) {
              console.log(`🔄 [${eventId}] Cargando proyectos desde INITIAL_SESSION`);
              await cargarProyectosUsuario(newSession.user.id);
            }
          }
        }
      } finally {
        isProcessingEvent = false;
        processingAuthEvent.current = false;
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user]); // Dependencia en user para reconectar si cambia la autenticación

  // Redirigir según el estado de autenticación
  useEffect(() => {
    if (loading) return;

    const currentPath = pathname || "";
    
    // Verificar si estamos en una página de autenticación
    const isAuthPage = (
      currentPath === "/login" ||
      currentPath === "/register" ||
      currentPath === "/reset-password" ||
      currentPath === "/"
    );

    // Reglas de redirección
    if (!user && !isAuthPage) {
      // Si no hay usuario autenticado y no estamos en una página de auth, redirigir a login
      console.log("Redirigiendo a login: usuario no autenticado y página requiere autenticación");
      router.push("/login");
    } else if (user && isAuthPage && currentPath !== "/") {
      // Si hay usuario autenticado y estamos en una página de auth (excepto home), redirigir a home
      console.log("Redirigiendo a home: usuario ya autenticado");
      router.push("/");
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        console.error("❌ Error en login:", error);
        return { error, success: false };
      }
      
      console.log("✅ Login exitoso, forzando recarga para sincronizar cookies...");
      // Forzar una recarga suave después del login para asegurar
      // que todas las cookies estén sincronizadas
      setTimeout(() => {
        window.location.href = '/'; // Redireccionar al inicio
      }, 500);
      
      return { error: null, success: true };
    } catch (error) {
      console.error("❌ Excepción en login:", error);
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
    // Generar ID único para logs
    const logoutId = Math.floor(Math.random() * 1000);
    console.log(`🔒 [${logoutId}] Iniciando logout...`);
    
    // Prevenir operaciones duplicadas
    if (processingAuthEvent.current) {
      console.log(`⚠️ [${logoutId}] Logout ya en proceso, abortando`);
      return;
    }
    
    processingAuthEvent.current = true;
    
    try {
      // IMPORTANTE: Primero hacer la operación de signOut en Supabase
      // Esto asegura que no tengamos parpadeos de UI mientras se limpia la sesión
      const { error } = await signOut();
      
      if (error) {
        console.error(`❌ [${logoutId}] Error durante signOut:`, error);
        throw error; // Propagar el error para manejar de forma consistente
      }
      
      console.log(`✅ [${logoutId}] Sesión cerrada en Supabase`);
      
      // Limpiar localStorage primero (operación síncrona)
      localStorage.removeItem('proyectoActualId');
      proyectosCargados.current = false;
      
      // Ahora redireccionar sin setTimeout - la redirección completa ya limpia el estado
      console.log(`🔙 [${logoutId}] Redirigiendo a login...`);

      // Usar replace en lugar de href para evitar entradas en el historial
      window.location.replace('/login');
    } catch (error) {
      console.error(`❌ [${logoutId}] Error en logout:`, error);
      
      // Solo limpiar estado local en caso de error
      setUser(null);
      setSession(null);
      setProyectoActual(null);
      setProyectosDisponibles([]);
      // Redirigir a login en caso de error (sin setTimeout)
      window.location.replace('/login');
    }
  };

  // Componente para mostrar el proyecto actual y permitir cambiarlo
  const ProyectoIndicator = () => {
    if (!user || cargandoProyectos) return null;
    
    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-2 z-50 flex items-center space-x-2">
        <div>
          <p className="text-xs text-gray-500">Proyecto actual:</p>
          <p className="font-medium">{proyectoActual?.nombre || 'Ninguno'}</p>
        </div>
        <Button 
          size="sm" 
          onClick={() => setMostrarSelectorProyecto(true)}
          variant="outline"
        >
          Cambiar
        </Button>
      </div>
    );
  };

  // Selector de proyectos (modal) - optimizado para evitar setTimeout
  const ProyectoSelectorModal = () => {
    // Effect simplificado - sin setTimeout
    useEffect(() => {
      if (proyectosDisponibles.length > 1 && !proyectoActual && !mostrarSelectorProyecto && !loading) {
        console.log("🚨 ALERTA: Múltiples proyectos disponibles, abriendo selector inmediatamente");
        setMostrarSelectorProyecto(true);
      }
    }, [proyectosDisponibles, proyectoActual, mostrarSelectorProyecto, loading]);
    
    return (
    <Dialog 
      open={mostrarSelectorProyecto && proyectosDisponibles.length > 0} 
      onOpenChange={(open) => {
        console.log("🔄 Estado del modal:", open ? "abriendo" : "cerrando");
        setMostrarSelectorProyecto(open);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecciona un proyecto</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {proyectosDisponibles.map((proyecto) => (
            <Card 
              key={proyecto.id} 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" 
              onClick={() => {
                console.log("🔄 Seleccionando proyecto:", proyecto);
                seleccionarProyecto(proyecto.id);
              }}
            >
              <h3 className="font-medium">{proyecto.nombre}</h3>
              {proyecto.codigo && <p className="text-sm text-gray-500">Código: {proyecto.codigo}</p>}
              {proyecto.descripcion && <p className="text-sm text-gray-500 mt-1">{proyecto.descripcion}</p>}
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setMostrarSelectorProyecto(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  }

  // Efecto para mostrar console.log con el proyecto actual
  useEffect(() => {
    if (proyectoActual) {
      console.log('🌟 PROYECTO ACTUAL:', proyectoActual);
    }
  }, [proyectoActual]);

  const debeBloquear = user && proyectosDisponibles.length > 0 && !proyectoActual;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authInitialized,
        proyectoActual,
        proyectosDisponibles,
        cargandoProyectos,
        seleccionarProyecto,
        signIn: login,
        signUp: signup,
        logout,
      }}
    >
      {/* Overlay bloqueante si no hay proyecto seleccionado */}
      {debeBloquear && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem 2.5rem',
            boxShadow: '0 2px 24px rgba(0,0,0,0.12)',
            textAlign: 'center',
          }}>
            <div className="mb-6 flex justify-center">
              <SustratoLoadingLogo 
                size={50}
                variant="spin-pulse"
                speed="normal"
                colorTransition
                showText
                text="Selecciona un proyecto para continuar"
              />
            </div>
            <p className="mt-4">Debes elegir un proyecto válido antes de acceder a la plataforma.</p>
          </div>
        </div>
      )}
      {/* Modal y resto de la app */}
      <ProyectoSelectorModal />
      <ProyectoIndicator />
      {/* Solo renderizar children si hay proyecto seleccionado o no hay proyectos disponibles */}
      {(!debeBloquear) && children}
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
