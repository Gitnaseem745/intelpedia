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
    
    const rejectedTools = await PendingTool.find({ status: 'rejected' }).sort({ updatedAt: -1 });
    
    if (!rejectedTools || rejectedTools.length === 0) {
      return NextResponse.json({
        message: 'No rejected tools found.',
        tools: []
      });
    }

    // Filter emojis from tags in the response
    const toolsWithFilteredTags = rejectedTools.map(tool => ({
      ...tool.toObject(),
      tags: filterEmojisFromTags(tool.tags)
    }));

    return NextResponse.json({
      message: `Total ${rejectedTools.length} rejected tools fetched from db.`,
      tools: toolsWithFilteredTags
    });
  } catch (error) {
    return handleError(error);
  }
}
