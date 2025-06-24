"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Plus, Calendar, CheckCircle, Clock, Star, LogOut, User } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "E-commerce Platform",
    status: "completed",
    startDate: "2024-01-15",
    completedDate: "2024-03-20",
    description: "Custom e-commerce solution with payment integration",
    hasReview: false,
  },
  {
    id: 2,
    name: "Mobile App Development",
    status: "in-progress",
    startDate: "2024-02-01",
    description: "Cross-platform mobile application for inventory management",
    hasReview: false,
  },
  {
    id: 3,
    name: "API Integration System",
    status: "completed",
    startDate: "2023-11-10",
    completedDate: "2024-01-05",
    description: "RESTful API development and third-party integrations",
    hasReview: true,
  },
]

export default function DashboardPage() {
  const handleAddReview = (projectId: number) => {
    // Handle adding review logic
    console.log("Adding review for project:", projectId)
  }

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logging out...")
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-sm">TechCorp Solutions</span>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your projects and track progress</p>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="projects" className="data-[state=active]:bg-gray-100">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="new-project" className="data-[state=active]:bg-gray-100">
              Request New Project
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Project History</h2>
              <Link href="/dashboard/new-project">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>

            <div className="grid gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-gray-900">{project.name}</CardTitle>
                        <CardDescription className="text-gray-600 mt-1">{project.description}</CardDescription>
                      </div>
                      <Badge
                        variant={project.status === "completed" ? "default" : "secondary"}
                        className={
                          project.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {project.status === "completed" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Started: {new Date(project.startDate).toLocaleDateString()}
                        </div>
                        {project.completedDate && (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed: {new Date(project.completedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      {project.status === "completed" && !project.hasReview && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddReview(project.id)}
                          className="border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Add Review
                        </Button>
                      )}
                      {project.hasReview && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Review Added
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new-project">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Request New Project</CardTitle>
                <CardDescription className="text-gray-600">Tell us about your next technical project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Next Project</h3>
                  <p className="text-gray-600 mb-6">
                    Ready to bring your technical vision to life? Let's discuss your requirements.
                  </p>
                  <Link href="/dashboard/new-project">
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white">Create Project Request</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
