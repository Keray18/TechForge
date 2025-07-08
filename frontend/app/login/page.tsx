"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, ArrowLeft } from "lucide-react"
import { login } from "@/app/utility/api" // Import the login function

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false) // Add loading state
  const [error, setError] = useState("") // Add error state
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === 'true'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError("") // Clear any previous errors
      
      // Call the login API
      const response = await login(formData)
      
      // Handle successful login
      console.log("Login successful:", response)
      
      // Get user role from response and redirect accordingly
      // This assumes your API returns a user object with a role property
      const userRole = response.user?.role || "client"
      
      // Store auth token in localStorage or cookies if provided
      if (response.token) {
        localStorage.setItem('authToken', response.token)
      }
      
      // Redirect to appropriate dashboard
      router.push(`/dashboard/${userRole}`)
    } catch (err: any) {
      // Handle login error
      console.error("Login error:", err)
      setError(err.response?.data?.message || "Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user makes changes
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your DevPortal dashboard</CardDescription>
          
          {/* Show success message if user just registered */}
          {justRegistered && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
              Registration successful! Please sign in with your new account.
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Display error message if any */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <Link href="/" className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
