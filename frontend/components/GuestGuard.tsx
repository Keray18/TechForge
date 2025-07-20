"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const user = authAPI.getCurrentUser()

      console.log('GuestGuard - Token exists:', !!token);
      console.log('GuestGuard - User exists:', !!user);
      console.log('GuestGuard - User role:', user?.role);

      if (token && user) {
        console.log('GuestGuard - User is logged in, redirecting to dashboard:', `/dashboard/${user.role}`);
        // User is logged in, redirect to their appropriate dashboard
        router.push(`/dashboard/${user.role}`)
        return
      }

      console.log('GuestGuard - User is guest, allowing access');
      setIsGuest(true)
      setLoading(false)
    }

    checkAuth()
  }, [router])

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

  if (!isGuest) {
    return null
  }

  return <>{children}</>
} 