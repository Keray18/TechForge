"use client"

import { useEffect, useState } from "react"
import { Loader } from "@/components/Loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projectAPI } from "@/lib/api"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus, LogOut, Menu, Bell } from "lucide-react"
import { NewProjectForm } from "./newProject/page"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/AuthGuard"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

function ClientDashboardContent() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  const fetchProjects = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await projectAPI.getClientProjects();
      setProjects(data.projects || [])
    } catch (err: any) {
      setError(err.message || 'Error loading projects')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  }

  useEffect(() => { fetchProjects() }, [])

  if (loading) return <Loader />
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="min-h-screen flex bg-[#f7fafd]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">
        <div className="flex flex-col items-center justify-center h-20 border-b">
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">NexusForge</span>
          {user.firstName && (
            <span className="mt-1 text-sm text-gray-700 font-semibold">{user.firstName} {user.lastName}</span>
          )}
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <Link href="/dashboard/client" className="block py-2 px-3 rounded-lg hover:bg-blue-50 font-semibold text-blue-700 bg-blue-100">My Projects</Link>
          <button className="block w-full text-left py-2 px-3 rounded-lg hover:bg-blue-50 font-semibold text-blue-700" onClick={() => setOpen(true)}>
            <Plus className="inline h-4 w-4 mr-2" /> New Project
          </button>
        </nav>
        <div className="p-6 border-t">
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">My Projects</h1>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"><Plus className="h-4 w-4 mr-2" /> New Project</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl p-0 bg-transparent border-none shadow-none">
                <NewProjectForm onClose={() => { setOpen(false); fetchProjects(); }} />
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-blue-600" />
              {/* Notification badge can go here */}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
          </div>
        </div>
        {/* Project List */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <svg width="120" height="120" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-blue-100"><rect width="24" height="24" rx="12" fill="#e0e7ff"/><path d="M7 17V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 17h10" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21h6" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div className="text-lg font-semibold text-gray-700 mb-2">No projects found</div>
            <div className="text-gray-500 mb-4">Start by creating your first project.</div>
            <Button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> New Project</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <Card key={p._id} className="shadow-md border border-blue-100 hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-blue-700 group-hover:underline cursor-pointer">
                    <span className="text-blue-600 hover:underline">{p.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold capitalize">{p.status}</span>
                    <span className="text-xs text-gray-400">Created: {new Date(p.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600 mb-2">
                    <div><span className="font-semibold text-gray-800">Category:</span> {p.category}</div>
                    <div><span className="font-semibold text-gray-800">Budget:</span> {p.budget}</div>
                    <div><span className="font-semibold text-gray-800">Timeline:</span> {p.timeline}</div>
                    <div><span className="font-semibold text-gray-800">Priority:</span> {p.priority}</div>
                  </div>
                  <div className="text-gray-700 text-base mb-1 whitespace-pre-line">
                    <span className="font-semibold text-gray-800">Description:</span> {p.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
