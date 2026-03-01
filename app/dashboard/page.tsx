"use client";

import { useState, useEffect } from 'react';
import { ServiceDashboard } from "@/components/service-dashboard"
import AuthBar from "@/components/auth-bar"

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Once the component mounts, we know we're on the client.
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <AuthBar />
      <main className="flex-1 p-8 bg-gray-50/50">
        <h1 className="text-3xl font-bold mb-6">AI Agent Dashboard</h1>
        {isClient ? <ServiceDashboard /> : <div className="flex items-center justify-center h-64">Initializing...</div>}
      </main>
    </div>
  )
}
