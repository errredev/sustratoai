// middleware.ts - OPTIMIZADO
import { createMiddlewareClient } from "@/lib/supabase-middleware-client";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";

export async function middleware(req: NextRequest) {
  // Identificador para registros más cortos y claros
  const requestId = Math.floor(Math.random() * 10000);
  console.log(`[MW:${requestId}] Ejecutando para: ${req.nextUrl.pathname}`);
  
  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/signup", "/reset-password", "/contact"];
  
  // Evitar ejecutar el middleware para rutas públicas
  if (publicRoutes.some(route => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`))) {
    console.log(`[MW:${requestId}] Ruta pública - acceso permitido`);
    return NextResponse.next();
  }
  
  // Recursos estáticos y APIs que deben omitirse para evitar sobrecarga del middleware
  const skipPatterns = [
    '/_next', '/api/', 'favicon', '.json', '.ico', '.png', '.jpg', '.svg', '.js', '.css', '.woff', '.woff2'
  ];
  
  // Verificación optimizada de patrones a omitir
  if (skipPatterns.some(pattern => req.nextUrl.pathname.includes(pattern))) {
    return NextResponse.next();
  }
  
  // Crear una respuesta que podemos modificar
  const res = NextResponse.next();
  
  try {
    // Crear cliente Supabase para el middleware - reducimos logs para mejorar rendimiento
    const supabase = createMiddlewareClient(req, res);
    
    // Intenta obtener/refrescar la sesión
    const { data } = await supabase.auth.getSession();
    
    // Si no hay sesión, redireccionar a login
    if (!data.session) {
      console.log(`[MW:${requestId}] Sin sesión - redirigiendo a /login`);
      const loginUrl = new URL('/login', req.url);
      // Almacenar la URL original para redireccionar después del login
      loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Si hay sesión, continuar con la solicitud
    console.log(`[MW:${requestId}] Sesión válida: ${data.session.user.id.substring(0, 8)}...`);
    return res;
  } catch (e) {
    console.error(`[MW:${requestId}] Error:`, e);
    // En caso de error, permitir el acceso para evitar bloqueos
    return NextResponse.next();
  }
  
  // Esta línea nunca se ejecutará porque todos los caminos anteriores tienen return
  // console.log(`[Middleware] Finalizando para: ${req.nextUrl.pathname}`);
  // return res;
}

// Configuración del middleware: asegura que se ejecute en las rutas necesarias
// y excluye las rutas estáticas o de API internas de Next.js.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
