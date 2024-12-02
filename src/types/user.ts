// src/types/user.ts
export interface User {
    id: string
    email: string
    role: 'ADMIN' | 'MANAGER' | 'VIEWER'
    firstName: string
    lastName: string
    mustChangePassword: boolean
  }