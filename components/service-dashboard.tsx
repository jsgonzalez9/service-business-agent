"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, BarChart, DollarSign } from 'lucide-react';

// Define the structure of our dashboard metrics
interface DashboardStats {
  total_leads: number;
  appointments_booked: number;
  booking_rate: number;
  potential_revenue: number;
}

// Reusable component for displaying a single metric
function StatCard({ title, value, icon: Icon, isCurrency = false, isPercentage = false }: { title: string, value: string | number, icon: React.ElementType, isCurrency?: boolean, isPercentage?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isCurrency ? `$${Number(value).toLocaleString()}` : value}{isPercentage ? '%' : ''}
        </div>
      </CardContent>
    </Card>
  );
}

export function ServiceDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data.');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="flex items-center justify-center h-64">No data available.</div>;
  }

  return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={stats.total_leads} icon={Users} />
        <StatCard title="Appointments Booked" value={stats.appointments_booked} icon={Calendar} />
        <StatCard title="Booking Rate" value={stats.booking_rate} icon={BarChart} isPercentage />
        <StatCard title="Potential Revenue" value={stats.potential_revenue} icon={DollarSign} isCurrency />
      </div>
  );
}
