import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  XCircle,
  Loader2
} from 'lucide-react';

interface DashboardMetrics {
  totalLiveTools: number;
  pendingSubmissions: number;
  approvedThisWeek: number;
  rejectedThisWeek: number;
}

interface MetricCardsProps {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
}

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-blue-600',
  isLoading = false 
}: {
  title: string;
  value: number | string;
  icon: any;
  iconColor?: string;
  isLoading?: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          value
        )}
      </div>
    </CardContent>
  </Card>
);

export default function MetricCards({ metrics, isLoading }: MetricCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Live Tools"
        value={metrics?.totalLiveTools || 0}
        icon={CheckCircle}
        iconColor="text-green-600"
        isLoading={isLoading}
      />
      <MetricCard
        title="Pending Submissions"
        value={metrics?.pendingSubmissions || 0}
        icon={Clock}
        iconColor="text-orange-600"
        isLoading={isLoading}
      />
      <MetricCard
        title="Approved This Week"
        value={metrics?.approvedThisWeek || 0}
        icon={TrendingUp}
        iconColor="text-blue-600"
        isLoading={isLoading}
      />
      <MetricCard
        title="Rejected This Week"
        value={metrics?.rejectedThisWeek || 0}
        icon={XCircle}
        iconColor="text-red-600"
        isLoading={isLoading}
      />
    </div>
  );
}
