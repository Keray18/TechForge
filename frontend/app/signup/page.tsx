"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { register } from "../utility/api"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const res = await register(formData);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Signup failed.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code className="h-8 w-8 text-gray-900" />
            <span className="text-2xl font-semibold text-gray-900">TechForge</span>
          </div>
        </div>

        <Card className="border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">Join us to start your next technical project</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-gray-700">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Your Company Ltd."
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">
                  FullName
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="John Doe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Company Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@yourcompany.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>
              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-gray-900 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
