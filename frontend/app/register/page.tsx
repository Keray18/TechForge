"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react"
import { authAPI } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Loader } from "@/components/Loader"
import { FormError } from "@/components/ui/FormError"
import { FormFieldError } from "@/components/ui/FormFieldError"
import { validateEmail, validatePassword, validateRequired } from "@/lib/validation"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    industry: "",
    company: "",
    phone: "",
  })
  const [fieldErrors, setFieldErrors] = useState<any>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    const errors: any = {}
    errors.firstName = validateRequired(formData.firstName, "First Name")
    errors.lastName = validateRequired(formData.lastName, "Last Name")
    errors.industry = validateRequired(formData.industry, "Industry")
    errors.email = validateEmail(formData.email)
    errors.phone = validateRequired(formData.phone, "Phone Number")
    errors.password = validatePassword(formData.password)
    errors.confirmPassword = formData.password !== formData.confirmPassword ? "Passwords do not match." : undefined
    setFieldErrors(errors)
    if (Object.values(errors).some(Boolean)) return
    
    try {
      setLoading(true)
      setError("")
      
      // Prepare data for API (remove confirmPassword)
      const { confirmPassword, ...apiData } = formData
      
      // Call the register API
      const response = await authAPI.register(apiData)
      
      // Handle successful registration
      console.log("Registration successful:", response)
      
      // Redirect to login page
      router.push("/login?registered=true")
    } catch (err: any) {
      // Handle registration error
      console.error("Registration error:", err)
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user makes changes
    if (error) setError("")
  }

  const nextStep = () => {
    // Basic validation for first step
    if (!formData.firstName || !formData.lastName || !formData.industry) {
      setError("Please fill in all required fields")
      return
    }
    
    setError("") // Clear any errors
    setStep(2)
  }

  const prevStep = () => {
    setError("") // Clear any errors
    setStep(1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join to start managing your development projects</CardDescription>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className="w-10 h-1 bg-gray-200 mx-1">
                <div className={`h-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ width: step === 1 ? '0%' : '100%', transition: 'width 0.3s ease' }}></div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FormError error={error} />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              // Step 1: Personal Information
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                    />
                    <FormFieldError error={fieldErrors.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                    />
                    <FormFieldError error={fieldErrors.lastName} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(value) => handleChange("industry", value)} value={formData.industry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance & Banking</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail & E-commerce</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="media">Media & Entertainment</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="nonprofit">Non-profit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormFieldError error={fieldErrors.industry} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input id="company" value={formData.company} onChange={(e) => handleChange("company", e.target.value)} />
                </div>

                <Button 
                  type="button" 
                  className="w-full" 
                  onClick={nextStep}
                  disabled={loading}
                >
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              // Step 2: Account Information
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                  <FormFieldError error={fieldErrors.email} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                  <FormFieldError error={fieldErrors.phone} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormFieldError error={fieldErrors.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      required
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormFieldError error={fieldErrors.confirmPassword} />
                </div>

                <div className="flex gap-2 mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={prevStep}
                    disabled={loading}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? <Loader className="h-5 w-5" /> : "Create Account"}
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
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
