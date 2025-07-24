'use client';

import { useDashboard } from '@/hooks/useDashboard';
import MetricCards from '@/components/admin/MetricCards';
import RecentActivityTable from '@/components/admin/RecentActivityTable';
import QuickActions from '@/components/admin/QuickActions';
import ModerationAlerts from '@/components/admin/ModerationAlerts';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading, error, refresh } = useDashboard();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your tools and monitor site activity</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg font-medium text-destructive mb-2">Error loading dashboard</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your tools and monitor site activity
          </p>
        </div>
        
        <Button 
          onClick={refresh} 
          variant="outline" 
          disabled={isLoading}
          className="w-fit"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Metrics Overview */}
      <MetricCards metrics={data?.metrics || null} isLoading={isLoading} />

      {/* Moderation Alerts */}
      <ModerationAlerts alerts={data?.alerts || []} />

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <RecentActivityTable 
          activities={data?.recentActivity || []} 
          isLoading={isLoading} 
        />
        
        {/* Quick Actions */}
        <QuickActions pendingCount={data?.metrics?.pendingSubmissions || 0} />
      </div>

      {/* Top Categories (if we want to show this) */}
      {data?.topCategories && data.topCategories.length > 0 && (
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
              {data.topCategories.map((category) => (
                <div 
                  key={category._id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                >
                  <span className="font-medium capitalize">{category._id}</span>
                  <span className="text-sm text-muted-foreground">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
