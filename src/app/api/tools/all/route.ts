import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PendingTool from '@/models/PendingTool';
import { handleError, validateRequest } from '@/lib/api-utils';
import { filterEmojisFromTags } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const methodError = validateRequest(request, ['GET']);
  if (methodError) return methodError;

  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter = { status };
    }
    
    const allTools = await PendingTool.find(filter).sort({ updatedAt: -1 });
    
    if (!allTools || allTools.length === 0) {
      return NextResponse.json({
        message: status ? `No ${status} tools found.` : 'No tools found.',
        tools: []
      });
    }

    // Filter emojis from tags in the response
    const toolsWithFilteredTags = allTools.map(tool => ({
      ...tool.toObject(),
      tags: filterEmojisFromTags(tool.tags)
    }));

    // Group tools by status for summary
    const summary = {
      total: allTools.length,
      pending: allTools.filter(tool => tool.status === 'pending').length,
      approved: allTools.filter(tool => tool.status === 'approved').length,
      rejected: allTools.filter(tool => tool.status === 'rejected').length
    };

    return NextResponse.json({
      message: status 
        ? `Total ${allTools.length} ${status} tools fetched from db.`
        : `Total ${allTools.length} tools fetched from db.`,
      tools: toolsWithFilteredTags,
      summary
    });
  } catch (error) {
    return handleError(error);
  }
}
