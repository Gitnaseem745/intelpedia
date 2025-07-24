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
    
    const pendingTools = await PendingTool.find({ status: 'pending' }).sort({ submittedAt: -1 });
    
    if (!pendingTools || pendingTools.length === 0) {
      return NextResponse.json({
        message: 'No pending tools found.',
        tools: []
      });
    }

    // Filter emojis from tags in the response
    const toolsWithFilteredTags = pendingTools.map(tool => ({
      ...tool.toObject(),
      tags: filterEmojisFromTags(tool.tags)
    }));

    return NextResponse.json({
      message: `Total ${pendingTools.length} pending tools fetched from db.`,
      tools: toolsWithFilteredTags
    });
  } catch (error) {
    return handleError(error);
  }
}
