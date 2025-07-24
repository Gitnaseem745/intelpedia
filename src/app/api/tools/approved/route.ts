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
    
    const approvedTools = await PendingTool.find({ status: 'approved' }).sort({ updatedAt: -1 });
    
    if (!approvedTools || approvedTools.length === 0) {
      return NextResponse.json({
        message: 'No approved tools found.',
        tools: []
      });
    }

    // Filter emojis from tags in the response
    const toolsWithFilteredTags = approvedTools.map(tool => ({
      ...tool.toObject(),
      tags: filterEmojisFromTags(tool.tags)
    }));

    return NextResponse.json({
      message: `Total ${approvedTools.length} approved tools fetched from db.`,
      tools: toolsWithFilteredTags
    });
  } catch (error) {
    return handleError(error);
  }
}
