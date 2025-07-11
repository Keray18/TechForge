"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, CheckCircle, XCircle, User, LogOut } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { NewProjectForm } from "./newProject/page"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

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
  const [open, setOpen] = useState(false)

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
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-3xl">
                <NewProjectForm onClose={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
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
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>Track the status of your development requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-6">
              {requests.map((request) => (
                <AccordionItem key={request.id} value={request.id.toString()} className="bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md">
                  <AccordionTrigger className="flex w-full items-center justify-between gap-6 px-6 py-5 group focus:outline-none">
                    <div className="flex flex-col items-start text-left flex-1">
                      <span className="text-xl font-bold mb-1 text-gray-900">{request.title}</span>
                      <span className="text-gray-500 text-base font-normal">{request.description}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      <Badge className={getStatusColor(request.status) + " px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"}>
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </Badge>
                      <span className="font-semibold text-green-600 text-lg">{request.budget}</span>
                    </div>
                    <span className="ml-4 transition-transform duration-200 group-data-[state=open]:rotate-180">
                      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-gray-50 px-8 pb-6 pt-2 rounded-b-xl border-t">
                    <Separator className="my-4" />
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <span className="text-gray-500 text-sm">Created: <span className="font-medium text-gray-700">{request.createdAt}</span></span>
                      <Button variant="default" className="w-full md:w-auto font-semibold shadow-sm">New Request</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
