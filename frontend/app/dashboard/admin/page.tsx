"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Users, Briefcase, Clock, CheckCircle, XCircle, LogOut } from "lucide-react"

// Mock data - in real app, this would come from your database
const mockRequests = [
  {
    id: 1,
    title: "E-commerce Website",
    client: "John Doe",
    assignedTo: "Alice Smith",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15",
    budget: "$5,000",
  },
  {
    id: 2,
    title: "Mobile App Development",
    client: "Jane Wilson",
    assignedTo: "Bob Johnson",
    status: "completed",
    priority: "medium",
    createdAt: "2024-01-10",
    budget: "$8,000",
  },
  {
    id: 3,
    title: "Website Redesign",
    client: "Mike Brown",
    assignedTo: "Carol Davis",
    status: "rejected",
    priority: "low",
    createdAt: "2024-01-20",
    budget: "$3,000",
  },
]

const mockUsers = [
  { id: 1, name: "John Doe", role: "client", email: "john@example.com", status: "active" },
  { id: 2, name: "Alice Smith", role: "employee", email: "alice@company.com", status: "active" },
  { id: 3, name: "Bob Johnson", role: "employee", email: "bob@company.com", status: "active" },
  { id: 4, name: "Carol Davis", role: "employee", email: "carol@company.com", status: "inactive" },
]

export default function AdminDashboard() {
  const [requests, setRequests] = useState(mockRequests)
  const [users] = useState(mockUsers)
  const [activeTab, setActiveTab] = useState("requests")

  const updateRequestStatus = (id: number, newStatus: string) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req)))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
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
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <p className="text-red-100">System Administration Panel</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "requests"
                  ? "border-red-500 text-red-600 bg-red-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Briefcase className="h-4 w-4 inline mr-2" />
              Requests Management
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "users"
                  ? "border-red-500 text-red-600 bg-red-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              User Management
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter((r) => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {requests.filter((r) => r.status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Management Tab */}
        {activeTab === "requests" && (
          <Card>
            <CardHeader>
              <CardTitle>All Requests</CardTitle>
              <CardDescription>Manage and update the status of all development requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <p className="text-sm text-gray-600">
                          Client: {request.client} | Assigned to: {request.assignedTo}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                        <Badge className={getStatusColor(request.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span>Created: {request.createdAt}</span>
                        <span className="ml-4 font-medium text-green-600">{request.budget}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Select
                          value={request.status}
                          onValueChange={(value) => updateRequestStatus(request.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          user.role === "admin" ? "destructive" : user.role === "employee" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
