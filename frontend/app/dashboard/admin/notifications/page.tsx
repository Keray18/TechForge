"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/Loader"
import { Trash2, CheckCircle2 } from "lucide-react"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${backendUrl}/api/notifications`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch notifications')
      const data = await res.json()
      setNotifications(data.data || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (err: any) {
      setError(err.message || 'Error loading notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotifications() }, [])

  const markAsRead = async (id: string) => {
    await fetch(`${backendUrl}/api/notifications/${id}/read`, { method: 'PATCH', credentials: 'include' })
    fetchNotifications()
  }

  const deleteNotification = async (id: string) => {
    await fetch(`${backendUrl}/api/notifications/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchNotifications()
  }

  if (loading) return <Loader />
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications {unreadCount > 0 && <span className="ml-2 text-blue-600">({unreadCount} unread)</span>}</h1>
      {notifications.length === 0 ? (
        <div className="text-gray-500">No notifications.</div>
      ) : (
        <ul className="space-y-4">
          {notifications.map(n => (
            <li key={n._id} className={`p-4 rounded shadow flex items-center justify-between ${n.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-gray-700">{n.message}</div>
                <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                {!n.isRead && <Button size="icon" variant="ghost" onClick={() => markAsRead(n._id)} title="Mark as read"><CheckCircle2 className="text-green-600" /></Button>}
                <Button size="icon" variant="ghost" onClick={() => deleteNotification(n._id)} title="Delete"><Trash2 className="text-red-600" /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 