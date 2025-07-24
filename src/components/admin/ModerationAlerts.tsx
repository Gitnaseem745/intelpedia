import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, XCircle, Eye, Plus } from 'lucide-react';
import Link from 'next/link';

interface Alert {
  type: 'warning' | 'info' | 'error';
  message: string;
  action: string;
}

interface ModerationAlertsProps {
  alerts: Alert[];
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'warning':
      return AlertTriangle;
    case 'error':
      return XCircle;
    case 'info':
    default:
      return Info;
  }
};

const getAlertColor = (type: string) => {
  switch (type) {
    case 'warning':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'error':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'info':
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200';
  }
};

const getActionButton = (action: string) => {
  switch (action) {
    case 'review-pending':
      return (
        <Button size="sm" variant="outline" asChild>
          <Link href="/admin/tools/pending">
            <Eye className="h-3 w-3 mr-1" />
            Review
          </Link>
        </Button>
      );
    case 'add-tool':
      return (
        <Button size="sm" variant="outline" asChild>
          <Link href="/submit-tool">
            <Plus className="h-3 w-3 mr-1" />
            Add Tool
          </Link>
        </Button>
      );
    default:
      return null;
  }
};

export default function ModerationAlerts({ alerts }: ModerationAlertsProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
              <Info className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">All caught up!</p>
              <p className="text-sm text-green-700">No pending moderation tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Moderation Alerts</h3>
        <p className="text-sm text-muted-foreground">
          Important tasks that need your attention
        </p>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = getAlertIcon(alert.type);
          const colorClass = getAlertColor(alert.type);
          
          return (
            <Card key={index} className={`border ${colorClass}`}>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      alert.type === 'warning' ? 'bg-orange-100' :
                      alert.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.message}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  {getActionButton(alert.action)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
