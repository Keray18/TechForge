"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'client'
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const user = authAPI.getCurrentUser()

      if (!token || !user) {
        router.push('/login')
        return
      }

      // Check role if required
      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        router.push(`/dashboard/${user.role}`)
        return
      }

      setAuthenticated(true)
      setLoading(false)
    }

    checkAuth()
  }, [router, requiredRole])

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