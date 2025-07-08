"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, CheckCircle, XCircle, User, LogOut } from "lucide-react"
import Link from "next/link"

// Mock data - in real app, this would come from your database
const mockRequests = [
  {
    id: 1,
    title: "E-commerce Website",
    description: "Need a full e-commerce website with payment integration",
    status: "pending",
    createdAt: "2024-01-15",
    budget: "$5,000",
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "React Native app for iOS and Android",
    status: "completed",
    createdAt: "2024-01-10",
    budget: "$8,000",
  },
  {
    id: 3,
    title: "Website Redesign",
    description: "Modernize existing company website",
    status: "rejected",
    createdAt: "2024-01-20",
    budget: "$3,000",
  },
]

export default function ClientDashboard() {
  const [requests] = useState(mockRequests)

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
              <p className="text-blue-100">Welcome back, John Doe</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/client/new-request">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{requests.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">
                {requests.filter((r) => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {requests.filter((r) => r.status === "completed").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {requests.filter((r) => r.status === "rejected").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Requests</CardTitle>
            <CardDescription>Track the status of your development requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{request.title}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{request.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Created: {request.createdAt}</span>
                    <span className="font-medium text-green-600">{request.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
