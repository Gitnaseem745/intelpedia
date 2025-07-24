'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Calendar,
  Tag,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface PendingTool {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  siteUrl: string;
  submittedAt: string;
  status: string;
}

export default function PendingToolsPage() {
  const [tools, setTools] = useState<PendingTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPendingTools = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tools/all?status=pending');
      if (!response.ok) throw new Error('Failed to fetch pending tools');
      
      const data = await response.json();
      // Only show tools that are actually pending
      const pendingTools = (data.tools || []).filter((tool: PendingTool) => tool.status === 'pending');
      setTools(pendingTools);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending tools');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (toolId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(toolId);
      
      const response = await fetch(`/api/tools/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId })
      });

      if (!response.ok) throw new Error(`Failed to ${action} tool`);
      
      // Remove the tool from the pending list since it's no longer pending
      setTools(tools.filter(tool => tool._id !== toolId));
    } catch (err) {
      console.error(`Error ${action}ing tool:`, err);
      alert(`Failed to ${action} tool. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchPendingTools();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tool Management</h1>
          <p className="text-muted-foreground">Review and moderate tool submissions</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg text-muted-foreground">Loading tools...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pending Submissions</h1>
          <p className="text-muted-foreground">Review and moderate tool submissions</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg font-medium text-destructive mb-2">Error loading tools</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchPendingTools} variant="outline">
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
          <h1 className="text-3xl font-bold">Pending Submissions</h1>
          <p className="text-muted-foreground">
            Review and moderate pending tool submissions ({tools.length} pending)
          </p>
        </div>
        
        <Button onClick={fetchPendingTools} variant="outline">
          <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Tools List */}
      {tools.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending submissions to review</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tools.map((tool) => (
            <Card key={tool._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {tool.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {tool.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {tool.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* URL */}
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Link 
                    href={tool.siteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {tool.siteUrl}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {/* Submitted date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Submitted on {formatDate(tool.submittedAt)}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => handleAction(tool._id, 'approve')}
                    disabled={actionLoading === tool._id}
                    className="flex-1"
                  >
                    {actionLoading === tool._id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleAction(tool._id, 'reject')}
                    disabled={actionLoading === tool._id}
                    variant="destructive"
                    className="flex-1"
                  >
                    {actionLoading === tool._id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
