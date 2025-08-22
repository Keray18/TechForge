"use client"

import React, { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils"
import { Loader } from "@/components/Loader"
import { FormError } from "@/components/ui/FormError"

type Client = {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  createdAt: string
  status: "active" | "invited"
  tempPassword?: string
}

function generateRandomPassword(length = 12): string {
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const upper = lower.toUpperCase()
  const digits = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  const all = lower + upper + digits + symbols
  const must = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ]

  const remainingLength = Math.max(0, length - must.length)
  const remaining = Array.from({ length: remainingLength }, () => all[Math.floor(Math.random() * all.length)])
  const raw = [...must, ...remaining]
  // Fisher–Yates shuffle
  for (let i = raw.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[raw[i], raw[j]] = [raw[j], raw[i]]
  }
  return raw.join("")
}

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [order, setOrder] = useState("desc")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Form state
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [company, setCompany] = useState("")

  // Dialog state
  const [showDialog, setShowDialog] = useState(false)
  const [generatedClient, setGeneratedClient] = useState<Client | null>(null)

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = clients.filter((c) =>
      [c.email, c.firstName, c.lastName, c.company].some((v) => v.toLowerCase().includes(q))
    )

    list = list.sort((a, b) => {
      let valA: string | number = ""
      let valB: string | number = ""
      if (sortBy === "createdAt") {
        valA = new Date(a.createdAt).getTime()
        valB = new Date(b.createdAt).getTime()
      } else if (sortBy === "firstName") {
        valA = a.firstName.toLowerCase()
        valB = b.firstName.toLowerCase()
      } else if (sortBy === "lastName") {
        valA = a.lastName.toLowerCase()
        valB = b.lastName.toLowerCase()
      } else if (sortBy === "company") {
        valA = a.company.toLowerCase()
        valB = b.company.toLowerCase()
      }
      if (valA < valB) return order === "asc" ? -1 : 1
      if (valA > valB) return order === "asc" ? 1 : -1
      return 0
    })

    return list
  }, [clients, search, sortBy, order])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredClients.length / limit)), [filteredClients.length, limit])
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * limit
  const end = start + limit
  const pagedClients = filteredClients.slice(start, end)

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients()
  }, [])

  // Reset to page 1 when filters/sorts change or page size changes
  React.useEffect(() => {
    setPage(1)
  }, [search, sortBy, order, limit])

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await fetch('/api/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }
      
      const data = await response.json()
      setClients(data.users || data.data || [])
    } catch (error: any) {
      console.error('Fetch clients error:', error)
      setError(error.message || 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const totalClients = clients.length
  const recentlyAdded = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return clients.filter((c) => new Date(c.createdAt).getTime() >= sevenDaysAgo).length
  }, [clients])

  const handleGenerateClient = () => {
    if (!email || !firstName || !lastName || !company) return
    const password = generateRandomPassword(12)
    const newClient: Client = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      company,
      createdAt: new Date().toISOString(),
      status: "invited",
      tempPassword: password,
    }

    // Frontend only: add to local list and show dialog with password
    setClients((prev) => [newClient, ...prev])
    setGeneratedClient(newClient)
    setShowDialog(true)

    // Clear form
    setEmail("")
    setFirstName("")
    setLastName("")
    setCompany("")
  }

  const handleCopyPassword = async () => {
    if (!generatedClient?.tempPassword) return
    try {
      await navigator.clipboard.writeText(generatedClient.tempPassword)
    } catch {
      // ignore
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <FormError error={error} />
      
      {/* Top controls (mirroring the Admin dashboard layout) */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest</SelectItem>
            <SelectItem value="firstName">First name</SelectItem>
            <SelectItem value="lastName">Last name</SelectItem>
            <SelectItem value="company">Company</SelectItem>
          </SelectContent>
        </Select>
        <Select value={order} onValueChange={(v) => setOrder(v)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recently Added (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recentlyAdded}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Invited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{clients.filter(c => c.status === "invited").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{clients.filter(c => c.status === "active").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Client */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Client</CardTitle>
          <CardDescription>Enter client details and generate a temporary password. Frontend-only for now.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="client@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Inc." value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
          </div>
          <Button
            className="mt-2"
            onClick={handleGenerateClient}
            disabled={!email || !firstName || !lastName || !company}
          >
            Generate Client
          </Button>
        </CardContent>
      </Card>

      {/* Clients List */
      }
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>Manage and review client accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="ml-auto flex items-center gap-2">
                  <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Page size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 / page</SelectItem>
                      <SelectItem value="10">10 / page</SelectItem>
                      <SelectItem value="20">20 / page</SelectItem>
                      <SelectItem value="50">50 / page</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                  <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                  <Button disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
                </div>
              </div>
              {filteredClients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No clients found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pagedClients.map((client) => (
                    <div key={client.id} className="rounded-lg border bg-white p-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {client.firstName} {client.lastName}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">{client.email}</p>
                          <p className="text-xs text-gray-400 mb-1">Company: {client.company}</p>
                          <p className="text-xs text-gray-400">
                            Created {formatRelativeTime(client.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={client.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {client.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filteredClients.length > 0 && (
                <div className="flex items-center justify-end gap-2 mt-6">
                  <Button disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                  <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                  <Button disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Generated Password Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Created</DialogTitle>
            <DialogDescription>
              Share the temporary password with the client. They should change it on first login.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{generatedClient?.firstName} {generatedClient?.lastName}</span>
              {" • "}
              <span>{generatedClient?.email}</span>
              {" • "}
              <span>{generatedClient?.company}</span>
            </div>
            <Separator />
            <div>
              <Label>Temporary Password</Label>
              <div className="mt-1 flex items-center gap-2">
                <Input readOnly value={generatedClient?.tempPassword || ""} className="font-mono" />
                <Button variant="outline" onClick={handleCopyPassword}>Copy</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ClientManagement
