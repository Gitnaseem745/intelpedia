import { useState, useEffect } from 'react';
import { PendingToolDocument } from '@/models/PendingTool';

interface UsePendingToolsResponse {
  data: { tools: PendingToolDocument[] } | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePendingTools(): UsePendingToolsResponse {
  const [data, setData] = useState<{ tools: PendingToolDocument[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingTools = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/tools/pending');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching pending tools:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTools();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPendingTools
  };
}

interface UseToolActionResponse {
  isLoading: boolean;
  error: string | null;
  approveTool: (toolId: string) => Promise<boolean>;
  rejectTool: (toolId: string) => Promise<boolean>;
}

export function useToolActions(): UseToolActionResponse {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveTool = async (toolId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tools/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error approving tool:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectTool = async (toolId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tools/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error rejecting tool:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    approveTool,
    rejectTool
  };
}
