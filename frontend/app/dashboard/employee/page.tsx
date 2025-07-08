"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCheck, Clock, CheckCircle, XCircle, LogOut, MessageSquare } from "lucide-react"

// Mock data - in real app, this would come from your database
const mockAssignedRequests = [
  {
    id: 1,
    title: "E-commerce Website",
    client: "John Doe",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15",
    budget: "$5,000",
    description: "Need a full e-commerce website with payment integration and inventory management.",
  },
  {
    id: 4,
    title: "Portfolio Website",
    client: "Sarah Johnson",
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-18",
    budget: "$2,000",
    description: "Personal portfolio website for a photographer with gallery and contact form.",
  },
]

export default function EmployeeDashboard() {
  const [requests, setRequests] = useState(mockAssignedRequests)

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
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <UserCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Employee Dashboard</h1>
              <p className="text-green-100">Welcome back, Alice Smith</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Assigned Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter((r) => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {requests.filter((r) => r.status === "completed").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Your Assigned Requests</CardTitle>
            <CardDescription>Manage and update the status of requests assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-xl">{request.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Client: {request.client}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(request.priority)}>{request.priority} priority</Badge>
                      <Badge className={getStatusColor(request.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(request.status)}
                          <span className="capitalize">{request.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Project Description:</h4>
                    <p className="text-gray-700">{request.description}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span>Created: {request.createdAt}</span>
                      <span className="ml-4 font-medium text-green-600">{request.budget}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Client
                      </Button>
                      <Select value={request.status} onValueChange={(value) => updateRequestStatus(request.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="rejected">Cannot Complete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              {requests.length === 0 && (
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests assigned</h3>
                  <p className="text-gray-600">You don't have any requests assigned to you at the moment.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
