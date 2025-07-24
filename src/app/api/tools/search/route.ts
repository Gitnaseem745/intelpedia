import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';
import { handleError, validateRequest } from '@/lib/api-utils';
import { filterEmojisFromTags } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const methodError = validateRequest(request, ['GET']);
  if (methodError) return methodError;

  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const tags = searchParams.get('tags');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let searchQuery: any = {};

    // Text search
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      searchQuery.tags = { $in: tagArray };
    }

    const totalTools = await Tool.countDocuments(searchQuery);
    const tools = await Tool.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter emojis from tags in the response
    const toolsWithFilteredTags = tools.map(tool => ({
      ...tool.toObject(),
      tags: filterEmojisFromTags(tool.tags)
    }));

    const totalPages = Math.ceil(totalTools / limit);

    return NextResponse.json({
      message: `Found ${tools.length} tools matching your search.`,
      tools: toolsWithFilteredTags,
      pagination: {
        currentPage: page,
        totalPages,
        totalTools,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    return handleError(error);
  }
}
