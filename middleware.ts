// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Récupérer le token depuis les cookies
  const token = request.cookies.get('auth-token')?.value
  
  // Vérifier si l'URL commence par /dashboard
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  
  // Si c'est une route du dashboard et qu'il n'y a pas de token
  if (isDashboardRoute && !token) {
    // Rediriger vers la page de login
    const loginUrl = new URL('/auth/login', request.url)
    // Stocker l'URL d'origine pour rediriger après la connexion
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Si l'utilisateur est connecté et essaie d'accéder à /login
  if (token && request.nextUrl.pathname === '/auth/login') {
    // Rediriger vers le dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Configurer sur quelles routes le middleware doit s'exécuter
export const config = {
  matcher: ['/dashboard/:path*', '/auth/login']
}