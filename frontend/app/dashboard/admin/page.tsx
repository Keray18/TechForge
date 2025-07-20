"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Users, Briefcase, Clock, CheckCircle, XCircle, LogOut, Eye, Check, X, Menu } from "lucide-react"
import { projectAPI, authAPI } from "@/lib/api"
import { formatRelativeTime } from "@/lib/utils"
import { NotificationBell } from "@/components/NotificationBell"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AuthGuard } from "@/components/AuthGuard"
import { Loader } from "@/components/Loader"
import { FormError } from "@/components/ui/FormError"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

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

// Utility functions moved to top-level scope
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
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [order, setOrder] = useState("desc")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
    const currentUser = authAPI.getCurrentUser()
    setUser(currentUser)
    // eslint-disable-next-line
  }, [search, sortBy, order, page, limit])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      // Debug: Check if token exists
      const token = localStorage.getItem('authToken');
      console.log('Token exists:', !!token);
      console.log('Token:', token ? token.substring(0, 20) + '...' : 'No token');
      
      const params = {
        search,
        sortBy,
        order,
        page: String(page),
        limit: String(limit),
      }
      
      console.log('Calling filterProjects with params:', params);
      const data = await projectAPI.filterProjects(params)
      console.log('API response:', data);
      
      setProjects(data.projects || [])
      setTotalPages(data.totalPages || 1)
    } catch (error: any) {
      console.error('Fetch projects error:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || error.message || 'Failed to load projects')
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

  const pendingProjects = projects.filter(p => p.status === 'pending')
  const acceptedProjects = projects.filter(p => p.status === 'accepted')
  const completedProjects = projects.filter(p => p.status === 'completed')
  const rejectedProjects = projects.filter(p => p.status === 'rejected')

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
          {/* Desktop actions */}
          <div className="hidden sm:flex items-center space-x-4">
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

      {/* Navigation Tabs */}
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <FormError error={error} />
        {/* Search, Sort, and Pagination Controls */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-64"
          />
          <Select value={sortBy} onValueChange={v => setSortBy(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Select value={order} onValueChange={v => setOrder(v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 ml-auto">
            <Button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
            <span>Page {page} of {totalPages}</span>
            <Button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
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
                    <AdminProjectCard
                      key={project._id}
                      project={project}
                      onAccept={handleAcceptProject}
                      onReject={handleRejectProject}
                      onComplete={handleCompleteProject}
                      actionLoading={actionLoading}
                      setSelectedProject={setSelectedProject}
                      setShowRejectDialog={setShowRejectDialog}
                    />
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

function AdminProjectCard({ project, onAccept, onReject, onComplete, actionLoading, setSelectedProject, setShowRejectDialog }: any) {
  return (
    <div className="rounded-lg border bg-white p-4 mb-4 shadow-sm flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
          <p className="text-xs text-gray-500 mb-1">
            Client: {project.client.firstName} {project.client.lastName} ({project.client.email})
          </p>
          <p className="text-xs text-gray-400 mb-1">
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
      {/* Action buttons for admin */}
      <div className="flex flex-wrap gap-2 mt-2">
        {project.status === "pending" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAccept(project._id)}
              disabled={actionLoading}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
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
              Reject
            </Button>
          </>
        )}
        {project.status === "accepted" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onComplete(project._id)}
            disabled={actionLoading}
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            Mark Complete
          </Button>
        )}
      </div>
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
