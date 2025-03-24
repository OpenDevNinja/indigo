// hooks/useAuth.ts

import { useRouter } from "next/router"

export function useAuth() {
    const router = useRouter()
    
    const logout = () => {
      // Supprimer le token
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      router.push('/auth/login')
    }
    
    return { logout }
  }