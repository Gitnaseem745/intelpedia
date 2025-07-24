import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Plus, Settings, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
  pendingCount: number;
}

export default function QuickActions({ pendingCount }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common administrative tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <Button asChild className="h-auto p-4 flex-col items-start">
            <Link href="/admin/tools/pending">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Review Submissions</span>
              </div>
              <span className="text-xs opacity-75">
                {pendingCount} pending tools
              </span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="h-auto p-4 flex-col items-start">
            <Link href="/submit-tool">
              <div className="flex items-center gap-2 mb-1">
                <Plus className="h-4 w-4" />
                <span className="font-medium">Add New Tool</span>
              </div>
              <span className="text-xs opacity-75">
                Submit a new tool
              </span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="h-auto p-4 flex-col items-start">
            <Link href="/admin/tools">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4" />
                <span className="font-medium">Manage Tools</span>
              </div>
              <span className="text-xs opacity-75">
                View all live tools
              </span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="h-auto p-4 flex-col items-start">
            <Link href="/tools">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Preview Site</span>
              </div>
              <span className="text-xs opacity-75">
                View public site
              </span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
