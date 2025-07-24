import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ToolInput } from '@/lib/validations/toolSchema';
import { ToolDocument } from '@/models/Tool';

const API_BASE = '/api/tools';

// API functions
const toolsApi = {
  getAll: async () => {
    const { data } = await axios.get(API_BASE);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axios.get(`${API_BASE}/${id}`);
    return data;
  },

  create: async (tool: ToolInput) => {
    const { data } = await axios.post(API_BASE, tool);
    return data;
  },

  update: async ({ id, tool }: { id: string; tool: Partial<ToolInput> }) => {
    const { data } = await axios.put(`${API_BASE}/${id}`, tool);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await axios.delete(`${API_BASE}/${id}`);
    return data;
  },

  search: async (params: {
    q?: string;
    tags?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.tags) searchParams.append('tags', params.tags);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const { data } = await axios.get(`${API_BASE}/search?${searchParams.toString()}`);
    return data;
  },

  getTags: async () => {
    const { data } = await axios.get(`${API_BASE}/tags`);
    return data;
  },

  bulkCreate: async () => {
    const { data } = await axios.post(`${API_BASE}/bulk`, { action: 'bulk-create' });
    return data;
  }
};

// Hooks
export const useTools = () => {
  return useQuery({
    queryKey: ['tools'],
    queryFn: toolsApi.getAll,
  });
};

export const useTool = (id: string) => {
  return useQuery({
    queryKey: ['tools', id],
    queryFn: () => toolsApi.getById(id),
    enabled: !!id,
  });
};

export const useToolSearch = (params: {
  q?: string;
  tags?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['tools', 'search', params],
    queryFn: () => toolsApi.search(params),
    // Always enable the query for pagination support
  });
};

export const useToolTags = () => {
  return useQuery({
    queryKey: ['tools', 'tags'],
    queryFn: toolsApi.getTags,
  });
};

export const useCreateTool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toolsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
};

export const useUpdateTool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toolsApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['tools', id] });
    },
  });
};

export const useDeleteTool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toolsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
};

export const useBulkCreateTools = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toolsApi.bulkCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
};
