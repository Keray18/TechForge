import { Suspense } from "react"
import LoginPage from "./LoginComponent"
import { GuestGuard } from "@/components/GuestGuard"

export default function Page() {
  return (
    <GuestGuard>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </Suspense>
    </GuestGuard>
  )
}
