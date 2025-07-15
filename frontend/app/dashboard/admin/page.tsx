"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Users, Briefcase, Clock, CheckCircle, XCircle, LogOut, Eye, Check, X } from "lucide-react"
import { projectAPI, authAPI } from "@/lib/api"
import { formatRelativeTime } from "@/lib/utils"
import { NotificationBell } from "@/components/NotificationBell"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  client: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
}

function AdminDashboardContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("requests")
  const [user, setUser] = useState<any>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
    const currentUser = authAPI.getCurrentUser()
    setUser(currentUser)
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectAPI.getAllProjects()
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

  const handleAcceptProject = async (projectId: string) => {
    try {
      setActionLoading(true)
      await projectAPI.acceptProject(projectId)
      await fetchProjects() // Refresh the list
    } catch (error: any) {
      console.error('Failed to accept project:', error)
      setError(error.response?.data?.message || 'Failed to accept project')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectProject = async (projectId: string) => {
    try {
      setActionLoading(true)
      await projectAPI.rejectProject(projectId, rejectionReason)
      setShowRejectDialog(false)
      setRejectionReason("")
      await fetchProjects() // Refresh the list
    } catch (error: any) {
      console.error('Failed to reject project:', error)
      setError(error.response?.data?.message || 'Failed to reject project')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCompleteProject = async (projectId: string) => {
    try {
      setActionLoading(true)
      await projectAPI.completeProject(projectId)
      await fetchProjects() // Refresh the list
    } catch (error: any) {
      console.error('Failed to complete project:', error)
      setError(error.response?.data?.message || 'Failed to complete project')
    } finally {
      setActionLoading(false)
    }
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

  const pendingProjects = projects.filter(p => p.status === 'pending')
  const acceptedProjects = projects.filter(p => p.status === 'accepted')
  const completedProjects = projects.filter(p => p.status === 'completed')
  const rejectedProjects = projects.filter(p => p.status === 'rejected')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-red-100">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
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

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "requests"
                ? "bg-red-100 text-red-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Requests ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending ({pendingProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "accepted"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Accepted ({acceptedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "completed"
                ? "bg-green-100 text-green-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Completed ({completedProjects.length})
          </button>
        </div>

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
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingProjects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{acceptedProjects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedProjects.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "requests" && "All Projects"}
              {activeTab === "pending" && "Pending Projects"}
              {activeTab === "accepted" && "Accepted Projects"}
              {activeTab === "completed" && "Completed Projects"}
            </CardTitle>
            <CardDescription>Manage and review project submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              let filteredProjects = projects
              if (activeTab === "pending") filteredProjects = pendingProjects
              else if (activeTab === "accepted") filteredProjects = acceptedProjects
              else if (activeTab === "completed") filteredProjects = completedProjects

              if (filteredProjects.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No projects found</p>
                  </div>
                )
              }

              return (
                <div className="space-y-6">
                  {filteredProjects.map((project) => (
                    <div key={project._id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl">{project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Client: {project.client.firstName} {project.client.lastName} ({project.client.email})
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Submitted {formatRelativeTime(project.createdAt)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
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

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Project Description:</h4>
                        <p className="text-gray-700">{project.description}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-4">
                          <p className="text-sm text-green-800">
                            <strong>Accepted:</strong> {formatRelativeTime(project.acceptedAt)}
                          </p>
                        </div>
                      )}

                      {project.status === "rejected" && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                          <p className="text-sm text-red-800">
                            <strong>Rejected:</strong> {formatRelativeTime(project.rejectedAt || '')}
                          </p>
                          {project.rejectionReason && (
                            <p className="text-sm text-red-700 mt-1">
                              <strong>Reason:</strong> {project.rejectionReason}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span>Created: {formatRelativeTime(project.createdAt)}</span>
                          <span className="ml-4 font-medium text-green-600">{project.budget}</span>
                        </div>

                        <div className="flex space-x-2">
                          {project.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAcceptProject(project._id)}
                                disabled={actionLoading}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProject(project)
                                  setShowRejectDialog(true)
                                }}
                                disabled={actionLoading}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                          {project.status === "accepted" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompleteProject(project._id)}
                              disabled={actionLoading}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Reject Project Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject "{selectedProject?.title}"? Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this project..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false)
                setRejectionReason("")
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedProject && handleRejectProject(selectedProject._id)}
              disabled={actionLoading || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? "Rejecting..." : "Reject Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminDashboardContent />
    </AuthGuard>
  )
}
