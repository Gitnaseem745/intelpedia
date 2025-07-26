import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';
import { toolSchema } from '@/lib/validations/toolSchema';
import { handleError, validateRequest } from '@/lib/api-utils';
import { filterEmojisFromTags } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const methodError = validateRequest(request, ['GET']);
  if (methodError) return methodError;

  try {
    await connectDB();
    
    const tools = await Tool.find().sort({ createdAt: -1 });
    
    if (!tools || tools.length === 0) {
      return NextResponse.json(
        { error: 'Please add some tools to db before fetching.' },
        { status: 404 }
      );
    }

    // Filter emojis from tags in the response
    const toolsWithFilteredTags = tools.map(tool => {
      const toolObj = tool.toObject();
      return {
        ...toolObj,
        tags: filterEmojisFromTags(toolObj.tags)
      };
    });

    return NextResponse.json({
      message: `Total ${tools.length} tools are fetched from db.`,
      tools: toolsWithFilteredTags
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  const methodError = validateRequest(request, ['POST']);
  if (methodError) return methodError;

  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate the request body
    const validatedData = toolSchema.parse(body);
    
    const { title, description, tags, siteUrl, imgUrl, features, featured, isFree, pricing } = validatedData;

    const newTool = await Tool.create({
      title,
      description,
      tags,
      siteUrl,
      imgUrl: imgUrl || '/images/placeholder.webp',
      features,
      featured: featured || false,
      isFree,
      pricing
    });

    // Trigger revalidation for the new tool page if revalidation secret is available
    if (process.env.REVALIDATION_SECRET) {
      try {
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_BASE_URL 
          : 'http://localhost:3000';
        
        await fetch(`${baseUrl}/api/tools/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toolId: newTool._id.toString(),
            secret: process.env.REVALIDATION_SECRET
          }),
        });
        
        console.log(`Triggered revalidation for new tool: ${newTool._id}`);
      } catch (revalidationError) {
        console.error('Failed to trigger revalidation:', revalidationError);
        // Don't fail the tool creation if revalidation fails
      }
    }

    return NextResponse.json(
      {
        message: `Tool with ${title} is added to db.`,
        newTool
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
