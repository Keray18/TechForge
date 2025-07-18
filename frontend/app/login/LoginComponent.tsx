"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { authAPI } from "@/lib/api"
import { Loader } from "@/components/Loader"
import { FormError } from "@/components/ui/FormError"
import { FormFieldError } from "@/components/ui/FormFieldError"
import { validateEmail, validatePassword } from "@/lib/validation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === 'true'
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    setFieldErrors({ email: emailError || undefined, password: passwordError || undefined })
    if (emailError || passwordError) return
    
    try {
      setLoading(true)
      setError("")
      
      // Call the login API
      const response = await authAPI.login(formData)
      
      // Handle successful login
      console.log("Login successful:", response)
      
      // Store auth data
      if (response.token && response.user) {
        authAPI.setAuthData(response.token, response.user)
      }
      
      // Get user role and redirect accordingly
      const userRole = response.user?.role || "client"
      
      // Redirect to appropriate dashboard
      router.push(`/dashboard/${userRole}`)
    } catch (err: any) {
      // Handle login error
      console.error("Login error:", err)
      const backendMsg = err.response?.data?.message || "";
      if (err.response?.status === 401 && backendMsg.toLowerCase().includes("verify")) {
        setError("Please complete email verification before logging in.");
      } else {
        setError(backendMsg || "Invalid email or password. Please try again.");
      }
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
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
          
          {/* Show success message if user just registered */}
          {justRegistered && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
              Registration successful! Please sign in with your new account.
            </div>
          )}
        </CardHeader>
        <CardContent>
          <FormError error={error} />
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
                className="w-full"
              />
              <FormFieldError error={fieldErrors.email} />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                disabled={loading}
                className="w-full pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              <FormFieldError error={fieldErrors.password} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader className="h-5 w-5" /> : "Sign In"}
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
