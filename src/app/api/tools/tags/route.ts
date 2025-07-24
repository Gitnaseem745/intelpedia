import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';
import { handleError, validateRequest } from '@/lib/api-utils';
import { removeEmojis } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const methodError = validateRequest(request, ['GET']);
  if (methodError) return methodError;

  try {
    await connectDB();
    
    // Get all unique tags from all tools
    const tags = await Tool.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { tag: '$_id', count: 1, _id: 0 } }
    ]);

    // Filter emojis from tags in the response
    const tagsWithoutEmojis = tags.map(tagData => ({
      ...tagData,
      tag: removeEmojis(tagData.tag)
    })).filter(tagData => tagData.tag.length > 0); // Remove empty tags after emoji removal

    return NextResponse.json({
      message: `Found ${tagsWithoutEmojis.length} unique tags.`,
      tags: tagsWithoutEmojis
    });
  } catch (error) {
    return handleError(error);
  }
}
