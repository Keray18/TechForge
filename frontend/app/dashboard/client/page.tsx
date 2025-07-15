"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, CheckCircle, XCircle, User, LogOut } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { NewProjectForm } from "./newProject/page"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { projectAPI, authAPI } from "@/lib/api"
import { formatRelativeTime } from "@/lib/utils"
import { NotificationBell } from "@/components/NotificationBell"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/AuthGuard"

interface Project {
  _id: string
  title: string
  description: string
  category: string
  budget: string
  timeline: string
  priority: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  createdAt: string
  acceptedAt?: string
  rejectedAt?: string
  rejectionReason?: string
}

function ClientDashboardContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
    const currentUser = authAPI.getCurrentUser()
    setUser(currentUser)
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectAPI.getClientProjects()
      // Backend returns { success: true, projects: [...] }
      setProjects(response.projects || [])
    } catch (error: any) {
      console.error('Failed to fetch projects:', error)
      setError(error.response?.data?.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authAPI.logout()
    router.push('/login')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Under Review"
      case "accepted":
        return "Accepted"
      case "completed":
        return "Completed"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleProjectSubmitted = () => {
    setOpen(false)
    fetchProjects() // Refresh the projects list
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Client Dashboard</h1>
              <p className="text-blue-100">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-3xl">
                <NewProjectForm onClose={handleProjectSubmitted} />
              </DialogContent>
            </Dialog>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {projects.filter((p) => p.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {projects.filter((p) => p.status === "accepted").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {projects.filter((p) => p.status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>Track the status of your submitted projects</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No projects submitted yet</p>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Project
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {projects.map((project) => (
                  <AccordionItem key={project._id} value={project._id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-left">{project.title}</h3>
                            <p className="text-sm text-gray-600 text-left">
                              Submitted {formatRelativeTime(project.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority} priority
                          </Badge>
                          <Badge className={getStatusColor(project.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(project.status)}
                              <span>{getStatusText(project.status)}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div>
                          <h4 className="font-medium mb-2">Project Description:</h4>
                          <p className="text-gray-700">{project.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Category</p>
                            <p className="text-sm">{project.category}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Budget</p>
                            <p className="text-sm">{project.budget}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Timeline</p>
                            <p className="text-sm">{project.timeline}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Priority</p>
                            <p className="text-sm capitalize">{project.priority}</p>
                          </div>
                        </div>

                        {project.status === "accepted" && project.acceptedAt && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800">
                              <strong>Project Accepted:</strong> {formatRelativeTime(project.acceptedAt)}
                            </p>
                          </div>
                        )}

                        {project.status === "rejected" && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">
                              <strong>Project Rejected:</strong> {formatRelativeTime(project.rejectedAt || '')}
                            </p>
                            {project.rejectionReason && (
                              <p className="text-sm text-red-700 mt-1">
                                <strong>Reason:</strong> {project.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}

                        {project.status === "completed" && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800">
                              <strong>Project Completed!</strong> Your project has been successfully delivered.
                            </p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function ClientDashboard() {
  return (
    <AuthGuard requiredRole="client">
      <ClientDashboardContent />
    </AuthGuard>
  )
}
