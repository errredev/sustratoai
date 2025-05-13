// --- START OF FILE proyecto-actions.ts ---

"use server"

// Ya no usamos createServerComponentClient para evitar problemas con cookies()
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// Ruta de importación CORREGIDA (sin .ts)
import { Database } from '@/lib/database.types';
import { createServerClient } from "@supabase/ssr";
import { createServerSupabaseClient } from "@/app/auth/session";
import { cookies } from "next/headers";


// Interfaz para el tipo de proyecto
export interface Proyecto {
  id: string;
  nombre: string;
  codigo?: string;
  descripcion?: string;
}

// Interfaz para el perfil de investigador (datos generales)
export interface PerfilInvestigador {
    user_id: string;
    nombre?: string | null; 
    apellido?: string | null;
    institucion?: string | null;
    telefono?: string | null;
    notas?: string | null;
}


// Tipo para los resultados de las funciones
type ResultadoOperacion<T> = 
  | { success: true; data: T }
  | { error: string; success?: false };

/**
 * NOTA SOBRE LA ESTRUCTURA ACTUAL:
 * Refactorizado para usar la tabla 'proyecto_miembro'.
 * RLS simplificadas a USING (auth.role() = 'authenticated') para SELECT.
 * La lógica de filtrado específica del usuario está en las consultas de la aplicación.
 */

/**
 * Obtiene los proyectos asociados a un usuario específico consultando la tabla de membresías.
 * Incluye depuración para verificar el contexto de autenticación en la DB.
 * Usa una estrategia de dos pasos para aislar errores de consulta.
 */
export async function obtenerProyectosUsuario(userId: string): Promise<ResultadoOperacion<Proyecto[]>> {
  // Generar un ID de operación para rastrear esta llamada específica
  const opId = Math.floor(Math.random() * 1000);
  console.log(`📄 [PY:${opId}] Iniciando obtenerProyectosUsuario para: ${userId.substring(0, 8)}...`);
  
  try {
    // Verificar que se ha proporcionado un userId válido
    if (!userId || userId.trim() === '') {
      console.error(`❌ [PY:${opId}] Error: userId no válido`);
      return { error: 'Se requiere un ID de usuario válido' };
    }
    
    console.log(`🔍 [PY:${opId}] Creando cliente Supabase para servidor...`);
    const supabase = await createServerSupabaseClient();

    // ***** INICIO: VERIFICACIÓN DIRECTA DE AUTH EN DB *****
    console.log(`🔑 [PY:${opId}] Verificando contexto de autenticación en DB...`);
    // Llamar a la función RPC para verificar el contexto de autenticación
    const { data: authContextResult, error: rpcError } = await supabase
      .rpc('get_current_auth_context'); 

    if (rpcError) {
      console.error(`❌ [PY:${opId}] Error al llamar RPC get_current_auth_context:`, rpcError);
      // Verificar si es un error de permisos o autenticación
      if (rpcError.code === '42501' || rpcError.message?.includes('permission denied')) {
        console.error(`❌ [PY:${opId}] ERROR DE PERMISOS: El cliente no tiene permisos suficientes`);
        return { error: `Error de permisos: No autorizado para ejecutar esta función` };
      }
      return { error: `Error al verificar contexto DB: ${rpcError.message}` };
    }

    // Verificación de la respuesta de la RPC (esperamos un array con un objeto)
    if (!authContextResult) {
      console.error(`❌ [PY:${opId}] RPC retornó resultado nulo`);
      return { error: "La verificación de autenticación retornó un resultado nulo" };
    }
    
    if (!Array.isArray(authContextResult)) {
      console.error(`❌ [PY:${opId}] RPC retornó un tipo inesperado:`, typeof authContextResult);
      return { error: `Formato inesperado: ${typeof authContextResult}` };
    }
    
    if (authContextResult.length === 0) {
      console.error(`❌ [PY:${opId}] RPC retornó array vacío`);
      return { error: "No se encontró contexto de autenticación" };
    }
    
    // Validar estructura del objeto de contexto
    const authContext = authContextResult[0];
    if (!authContext || typeof authContext !== 'object') {
        console.error(`❌ [PY:${opId}] RPC retornó un objeto inválido:`, authContext);
        return { error: "Formato inválido del contexto de autenticación" };
    }
    
    if (!('current_uid' in authContext) || !('current_role' in authContext)) {
        console.error(`❌ [PY:${opId}] RPC retornó objeto sin propiedades requeridas:`, Object.keys(authContext));
        return { error: "Faltan propiedades requeridas en el contexto de autenticación" };
    }

    // Extraer y validar valores del contexto
    const { current_uid, current_role } = authContext as { current_uid: string | null, current_role: string | null };
    console.log(`🔑 [PY:${opId}] Contexto DB: UID=${current_uid?.substring(0, 8) || 'null'}, ROLE=${current_role}`);

    // Comprobar si tenemos el rol correcto
    if (current_role !== 'authenticated') {
        console.error(`❌ [PY:${opId}] ERROR DE ROL: Se requiere 'authenticated', pero se obtuvo '${current_role}'`);
        return { error: `No autorizado: rol '${current_role}' insuficiente` };
    }
    
    // Verificar coincidencia de usuario
    if (current_uid !== userId) {
         console.warn(`⚠️ [PY:${opId}] DISCREPANCIA DE USUARIO: Cliente pide ${userId.substring(0, 8)}, pero la DB ve ${current_uid?.substring(0, 8) || 'null'}`);
         // Intentamos usar el UID de la DB si está disponible, para respetar RLS
         if (current_uid) {
           console.log(`🔄 [PY:${opId}] Usando UID de DB para consulta: ${current_uid.substring(0, 8)}...`);
           userId = current_uid; // Usar el ID que la DB reconoce
         }
    }

    console.log(`✅ [PY:${opId}] Contexto de DB validado correctamente`);
    // ***** FIN: VERIFICACIÓN DIRECTA DE AUTH EN DB *****

    // PASO 1: Obtener las membresías del usuario
    console.log(`🔍 [PY:${opId}] Paso 1: Consultando membresías para usuario ${userId.substring(0, 8)}...`);
    const { data: membresias, error: errorMembresias } = await supabase
      .from('proyecto_miembro')
      .select('proyecto_id') 
      .eq('user_id', userId);

    if (errorMembresias) {
      console.error(`❌ [PY:${opId}] Error en Paso 1 (membresías):`, errorMembresias);
      
      // Verificar si es un problema de RLS o permisos
      if (errorMembresias.code === '42501' || errorMembresias.message?.includes('permission denied')) {
        console.error(`❌ [PY:${opId}] ERROR DE PERMISOS en tabla proyecto_miembro`);
        return { error: `Sin acceso a tabla proyecto_miembro: ${errorMembresias.message}` };
      }
      
      return { error: `Error al obtener membresías: ${errorMembresias.message}` };
    }

    if (!membresias || membresias.length === 0) {
      console.log(`ℹ️ [PY:${opId}] No se encontraron membresías para el usuario ${userId.substring(0, 8)}...`);
      return { success: true, data: [] };
    }
    
    console.log(`✅ [PY:${opId}] Paso 1 completado: ${membresias.length} membresías encontradas`);

    const proyectoIds = membresias.map(m => m.proyecto_id);
    console.log(`🔍 [PY:${opId}] Paso 2: Consultando ${proyectoIds.length} proyectos: ${proyectoIds.slice(0, 3).join(', ')}${proyectoIds.length > 3 ? '...' : ''}`);

    const { data: proyectosData, error: errorProyectos } = await supabase
      .from('proyectos')
      .select('id, nombre, codigo, descripcion')
      .in('id', proyectoIds);

    if (errorProyectos) {
      console.error(`❌ [PY:${opId}] Error en Paso 2 (proyectos):`, errorProyectos);
      
      // Verificar si es un problema de RLS o permisos
      if (errorProyectos.code === '42501' || errorProyectos.message?.includes('permission denied')) {
        console.error(`❌ [PY:${opId}] ERROR DE PERMISOS en tabla proyectos`);
        return { error: `Sin acceso a tabla proyectos: ${errorProyectos.message}` };
      }
      
      return { error: `Error al obtener detalles de proyectos: ${errorProyectos.message}` };
    }
    
    if (!proyectosData || proyectosData.length === 0) {
      console.log(`ℹ️ [PY:${opId}] No se encontraron proyectos para los IDs proporcionados`);
      return { success: true, data: [] };
    }
    
    console.log(`✅ [PY:${opId}] Paso 2 completado: ${proyectosData.length} proyectos encontrados`);

    // Mapeo a la interfaz Proyecto
    const proyectos = proyectosData.map(p => ({
      id: String(p.id), // Asegurar que id sea string
      nombre: p.nombre,
      codigo: p.codigo || "",
      descripcion: p.descripcion || ""
    }));

    console.log(`🎉 [PY:${opId}] ÉXITO: ${proyectos.length} proyectos obtenidos para usuario ${userId.substring(0, 8)}...`);
    // Registrar los nombres de los proyectos para depuración
    proyectos.forEach((p, i) => {
      console.log(`✅ [PY:${opId}] Proyecto ${i+1}: ID=${p.id}, Nombre="${p.nombre}", Código=${p.codigo || 'N/A'}`);
    });
    
    return { success: true, data: proyectos };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error(`❌ [PY:${opId}] Excepción no controlada:`, error);
    return { error: `Error interno del servidor: ${errorMessage}` };
  }
}

/**
 * Obtiene un proyecto por su ID.
 */
export async function obtenerProyectoPorId(proyectoId: string): Promise<ResultadoOperacion<Proyecto | null>> {
  try {
    // Crear cliente Supabase usando las variables de entorno directamente
    const supabase = await createServerSupabaseClient();
    
    console.log("Consultando proyecto con ID:", proyectoId);

    const { data, error } = await supabase
      .from("proyectos") 
      .select("id, nombre, codigo, descripcion")
      .eq("id", proyectoId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`Proyecto con ID ${proyectoId} no encontrado o no accesible por RLS.`);
        return { success: true, data: null }; 
      }
      console.error("Error al obtener proyecto por ID:", error);
      return { error: `Error al obtener la información del proyecto: ${error.message}` };
    }
    
    const proyectoFormateado: Proyecto = {
      id: String(data.id), 
      nombre: data.nombre,
      codigo: data.codigo || "",
      descripcion: data.descripcion || ""
    };

    return { success: true, data: proyectoFormateado };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error inesperado en obtenerProyectoPorId:", error);
    return { error: `Ocurrió un error inesperado: ${errorMessage}` };
  }
}

/**
 * Obtiene los perfiles de los miembros de un proyecto específico.
 */
export async function obtenerPerfilesMiembrosProyecto(proyectoId: string): Promise<ResultadoOperacion<PerfilInvestigador[]>> {
    try {
        // Crear cliente Supabase usando las variables de entorno directamente
        const supabase = createServerClient<Database>(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { cookies: cookies() }
        );
        console.log(`Consultando perfiles de miembros para proyecto ${proyectoId}`);

        // Consulta proyecto_miembro y une con perfil_investigador
        const { data: miembros, error } = await supabase
            .from('proyecto_miembro')
            .select(`
                user_id,
                rol_en_proyecto, 
                perfil_investigador ( 
                    user_id,
                    nombre,
                    apellido,
                    institucion,
                    telefono, 
                    notas      
                )
            `) 
            .eq('proyecto_id', proyectoId);

        if (error) {
            console.error("Error al obtener miembros del proyecto:", error);
            return { error: `Error al obtener miembros del proyecto: ${error.message}` };
        }
        if (!miembros) {
            return { success: true, data: [] };
        }

        // Extrae solo los datos del perfil, filtrando posibles nulos si RLS bloqueó algo
        const perfiles = miembros
            .map(m => m.perfil_investigador) 
            .filter(p => p !== null && typeof p === 'object') as PerfilInvestigador[]; 
        
        console.log(`Se encontraron ${perfiles.length} perfiles para el proyecto ${proyectoId}`);
        return { success: true, data: perfiles }; 

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        console.error("Error inesperado en obtenerPerfilesMiembrosProyecto:", error);
        return { error: `Ocurrió un error inesperado al obtener los perfiles: ${errorMessage}` };
    }
}

// --- END OF FILE proyecto-actions.ts ---