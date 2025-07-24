import { useState } from 'react';
import { PendingToolDocument } from '@/models/PendingTool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  ExternalLink, 
  Calendar,
  Tag,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useToolActions } from '@/hooks/usePendingTools';
import { useToast } from '@/hooks/use-toast';

interface PendingToolCardProps {
  tool: PendingToolDocument;
  onActionComplete: () => void;
}

export default function PendingToolCard({ tool, onActionComplete }: PendingToolCardProps) {
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null);
  const { approveTool, rejectTool } = useToolActions();
  const { toast } = useToast();

  const handleApprove = async () => {
    setActionLoading('approve');
    
    const success = await approveTool(tool._id?.toString() || '');
    
    if (success) {
      toast({
        title: "Tool Approved",
        description: `"${tool.title}" has been approved and moved to the main collection.`,
      });
      onActionComplete();
    } else {
      toast({
        title: "Approval Failed",
        description: "There was an error approving the tool. Please try again.",
        variant: "destructive",
      });
    }
    
    setActionLoading(null);
  };

  const handleReject = async () => {
    setActionLoading('reject');
    
    const success = await rejectTool(tool._id?.toString() || '');
    
    if (success) {
      toast({
        title: "Tool Rejected",
        description: `"${tool.title}" has been rejected and removed from pending submissions.`,
      });
      onActionComplete();
    } else {
      toast({
        title: "Rejection Failed",
        description: "There was an error rejecting the tool. Please try again.",
        variant: "destructive",
      });
    }
    
    setActionLoading(null);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 mb-1">
              {tool.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {tool.description}
            </CardDescription>
          </div>
          <Link
            href={tool.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Submission Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4" />
          <span>Submitted {formatDate(tool.submittedAt || tool.createdAt)}</span>
        </div>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <Tag className="h-3 w-3" />
              <span className="text-xs font-medium text-muted-foreground">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tool.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tool.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.tags.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {tool.features && tool.features.length > 0 && (
          <div className="mb-4 flex-1">
            <h4 className="text-sm font-medium mb-2">Features</h4>
            <div className="space-y-2">
              {tool.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{feature.name}:</span>{' '}
                  <span className="text-muted-foreground line-clamp-2">
                    {feature.details}
                  </span>
                </div>
              ))}
              {tool.features.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{tool.features.length - 3} more features
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-4 border-t">
          <Button
            onClick={handleApprove}
            disabled={actionLoading !== null}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            {actionLoading === 'approve' ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Approve
          </Button>
          
          <Button
            onClick={handleReject}
            disabled={actionLoading !== null}
            variant="destructive"
            className="flex-1"
            size="sm"
          >
            {actionLoading === 'reject' ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
