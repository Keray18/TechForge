"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authAPI } from '@/lib/api'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'client'
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const user = authAPI.getCurrentUser()

      console.log('AuthGuard - Token exists:', !!token);
      console.log('AuthGuard - User exists:', !!user);
      console.log('AuthGuard - User role:', user?.role);
      console.log('AuthGuard - Required role:', requiredRole);
      console.log('AuthGuard - Current path:', pathname);

      if (!token || !user) {
        console.log('AuthGuard - No token or user, redirecting to home page');
        router.push('/')
        return
      }

      // Check role if required
      if (requiredRole && user.role !== requiredRole) {
        console.log('AuthGuard - Role mismatch: user role', user.role, 'does not match required role', requiredRole);
        // Redirect to appropriate dashboard based on user role
        const appropriateDashboard = `/dashboard/${user.role}`
        console.log('AuthGuard - Redirecting to appropriate dashboard:', appropriateDashboard);
        router.push(appropriateDashboard)
        return
      }

      console.log('AuthGuard - Authentication successful');
      setAuthenticated(true)
      setLoading(false)
    }

    checkAuth()
  }, [router, requiredRole, pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
} 