"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, CheckCircle, XCircle, User, LogOut, Menu } from "lucide-react"
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
import { Loader } from "@/components/Loader"
import { FormError } from "@/components/ui/FormError"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

// Move these functions above ProjectCard so they are in scope
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border bg-white p-4 mb-4 shadow-sm flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
          <p className="text-xs text-gray-500 mb-1">
            Submitted {formatRelativeTime(project.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className={getPriorityColor(project.priority)}>{project.priority} priority</Badge>
          <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
        </div>
      </div>
      <div className="text-xs text-gray-600 mb-2">
        <span className="block">Category: <span className="font-medium text-gray-800">{project.category}</span></span>
        <span className="block">Budget: <span className="font-medium text-green-700">{project.budget}</span></span>
        <span className="block">Timeline: <span className="font-medium text-gray-800">{project.timeline}</span></span>
        <span className="block">Priority: <span className="font-medium text-gray-800 capitalize">{project.priority}</span></span>
      </div>
      <div className="mb-2">
        <h4 className="font-medium text-sm mb-1">Project Description:</h4>
        <p className="text-sm text-gray-700 whitespace-pre-line">{project.description}</p>
      </div>
      {project.status === "accepted" && project.acceptedAt && (
        <div className="p-2 bg-green-50 border border-green-200 rounded mb-1 text-xs">
          <span className="text-green-800 font-medium">Accepted: {formatRelativeTime(project.acceptedAt)}</span>
        </div>
      )}
      {project.status === "rejected" && (
        <div className="p-2 bg-red-50 border border-red-200 rounded mb-1 text-xs">
          <span className="text-red-800 font-medium">Rejected: {formatRelativeTime(project.rejectedAt || '')}</span>
          {project.rejectionReason && (
            <span className="block text-red-700 mt-1">Reason: {project.rejectionReason}</span>
          )}
        </div>
      )}
      {project.status === "completed" && (
        <div className="p-2 bg-green-50 border border-green-200 rounded mb-1 text-xs">
          <span className="text-green-800 font-medium">Project Completed!</span>
        </div>
      )}
    </div>
  )
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

  const handleProjectSubmitted = () => {
    setOpen(false)
    fetchProjects() // Refresh the projects list
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-10 w-10" />
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
          {/* Desktop actions */}
          <div className="hidden sm:flex items-center space-x-4">
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
          {/* Mobile hamburger/profile menu */}
          <div className="flex sm:hidden items-center">
            <NotificationBell />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-2">
                <div className="flex flex-col space-y-2">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-start" variant="ghost">
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
                    className="w-full justify-start text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-8">
        <FormError error={error} />

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
                      <ProjectCard project={project} />
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
