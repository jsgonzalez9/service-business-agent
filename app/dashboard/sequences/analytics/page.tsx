"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function SequenceAnalyticsPage() {
  const [data, setData] = useState<Record<string, any>>({})
  useEffect(() => {
    ;(async () => {
      try {
        const resp = await fetch("/api/sequences/analytics")
        const j = await resp.json()
        setData(j.analytics || {})
      } catch {}
    })()
  }, [])
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Sequence Analytics</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(data).map(([seqId, stats]) => (
              <div key={seqId} className="rounded border border-border p-2 text-sm">
                <p className="font-medium">Sequence {seqId}</p>
                <div className="flex gap-4 mt-1">
                  <span>Sent: {(stats as any).sent}</span>
                  <span>Queued: {(stats as any).queued}</span>
                  <span>Errors: {(stats as any).errors}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
