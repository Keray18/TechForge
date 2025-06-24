"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Code, ArrowLeft, Send } from "lucide-react"

const projectTypes = [
  "Web Application",
  "Mobile App (iOS/Android)",
  "Desktop Application",
  "API Development",
  "E-commerce Platform",
  "Custom Software",
  "Other",
]

const features = [
  "User Authentication",
  "Payment Integration",
  "Database Management",
  "Real-time Features",
  "Third-party Integrations",
  "Admin Dashboard",
  "Mobile Responsive",
  "Analytics & Reporting",
]

export default function NewProjectPage() {
  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    description: "",
    requirements: "",
    timeline: "",
    budget: "",
    selectedFeatures: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Project request:", formData)
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: checked
        ? [...prev.selectedFeatures, feature]
        : prev.selectedFeatures.filter((f) => f !== feature),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-gray-900" />
            <span className="text-xl font-semibold text-gray-900">TechBuild</span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">New Project Request</h1>
          <p className="text-gray-600">Tell us about your project requirements and we'll get back to you</p>
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Project Details</CardTitle>
            <CardDescription className="text-gray-600">
              Provide as much detail as possible to help us understand your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-gray-700">
                    Project Name
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="My Awesome Project"
                    value={formData.projectName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
                    required
                    className="border-gray-200 focus:border-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectType" className="text-gray-700">
                    Project Type
                  </Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, projectType: value }))}>
                    <SelectTrigger className="border-gray-200 focus:border-gray-400">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its purpose, and target audience..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  className="border-gray-200 focus:border-gray-400 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-gray-700">
                  Specific Requirements
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="List any specific technical requirements, integrations, or constraints..."
                  value={formData.requirements}
                  onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                  className="border-gray-200 focus:border-gray-400 min-h-[100px]"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">Desired Features</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                      />
                      <Label htmlFor={feature} className="text-sm text-gray-700 cursor-pointer">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timeline" className="text-gray-700">
                    Preferred Timeline
                  </Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, timeline: value }))}>
                    <SelectTrigger className="border-gray-200 focus:border-gray-400">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1 month">1 month</SelectItem>
                      <SelectItem value="2-3 months">2-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6+ months">6+ months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-gray-700">
                    Budget Range
                  </Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}>
                    <SelectTrigger className="border-gray-200 focus:border-gray-400">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5k">Under $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k+">$50,000+</SelectItem>
                      <SelectItem value="discuss">Let's discuss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <Link href="/dashboard">
                  <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
