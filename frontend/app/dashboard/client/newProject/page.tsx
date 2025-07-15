"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, FilePlus2, Loader2 } from "lucide-react"
import { projectAPI } from "@/lib/api"

export function NewProjectForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    timeline: "",
    priority: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError("")
      
      // Submit project to API
      const response = await projectAPI.submitProject(formData)
      
      console.log("Project submitted successfully:", response)
      
      // Close the form
      onClose()
    } catch (err: any) {
      console.error("Failed to submit project:", err)
      setError(err.response?.data?.message || "Failed to submit project. Please try again.")
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
    <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <FilePlus2 className="h-6 w-6 text-blue-600" />
          <CardTitle>Submit New Project</CardTitle>
        </div>
        <CardDescription className="text-blue-800">Provide details about your development project</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., E-commerce Website Development"
              required
              disabled={loading}
              className="focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => handleChange("category", value)} disabled={loading}>
              <SelectTrigger className="focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Select project category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-app">Mobile App</SelectItem>
                <SelectItem value="desktop-app">Desktop Application</SelectItem>
                <SelectItem value="api-development">API Development</SelectItem>
                <SelectItem value="database-design">Database Design</SelectItem>
                <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Provide detailed description of your project requirements, features needed, target audience, etc."
              rows={6}
              required
              disabled={loading}
              className="focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select onValueChange={(value) => handleChange("budget", value)} disabled={loading}>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-400">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1k">Under $1,000</SelectItem>
                  <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="over-50k">Over $50,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Select onValueChange={(value) => handleChange("timeline", value)} disabled={loading}>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-400">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="1-week">Within 1 week</SelectItem>
                  <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="2-months">Within 2 months</SelectItem>
                  <SelectItem value="3-months">Within 3 months</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select onValueChange={(value) => handleChange("priority", value)} disabled={loading}>
              <SelectTrigger className="focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
