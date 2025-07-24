import { useState, useEffect } from 'react';

interface DashboardMetrics {
  totalLiveTools: number;
  pendingSubmissions: number;
  approvedThisWeek: number;
  rejectedThisWeek: number;
}

interface RecentActivity {
  _id: string;
  title: string;
  submittedAt: string;
  status: string;
}

interface Alert {
  type: 'warning' | 'info' | 'error';
  message: string;
  action: string;
}

interface TopCategory {
  _id: string;
  count: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity: RecentActivity[];
  alerts: Alert[];
  topCategories: TopCategory[];
}

interface UseDashboardResult {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh: fetchDashboard
  };
}
