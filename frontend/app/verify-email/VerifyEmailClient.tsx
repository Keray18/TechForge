"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader } from "@/components/Loader"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function VerifyEmailClient() {
  const [status, setStatus] = useState<'pending'|'success'|'error'>("pending")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided.')
      return
    }
    const verify = async () => {
      try {
        const res = await fetch(`${backendUrl}/verify?token=${token}`);
        if (!res.ok) throw new Error('Verification failed')
        setStatus('success')
        setMessage('Email verified! Redirecting to login...')
        setTimeout(() => router.push('/login'), 2000)
      } catch (err: any) {
        setStatus('error')
        setMessage(err.message || 'Verification failed')
      }
    }
    verify()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {status === 'pending' && <Loader />}
      <div className="text-xl font-bold mb-2">{status === 'success' ? 'Success!' : status === 'error' ? 'Error' : ''}</div>
      <div className={status === 'error' ? 'text-red-600' : 'text-green-600'}>{message}</div>
    </div>
  )
} 