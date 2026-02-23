import { checkDatabaseSetup } from "@/lib/lead-actions"
import { ServiceDashboard } from "@/components/service-dashboard"
import AuthBar from "@/components/auth-bar"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const dbReady = await checkDatabaseSetup()

  if (!dbReady) {
    redirect("/setup")
  }

  return (
    <div className="flex flex-col h-screen">
      <AuthBar />
      <main className="flex-1 p-8 bg-gray-50/50">
        <h1 className="text-3xl font-bold mb-6">AI Agent Dashboard</h1>
        <ServiceDashboard />
        {/* The rest of the lead management UI will go here */}
      </main>
    </div>
  )
}
