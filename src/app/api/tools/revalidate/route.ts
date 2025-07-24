import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, secret } = body;

    // Check for secret to prevent unauthorized access
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    if (toolId) {
      // Revalidate specific tool page
      await revalidatePath(`/tools/${toolId}`);
      
      return NextResponse.json({ 
        message: `Tool page ${toolId} revalidated successfully`,
        revalidated: true,
        timestamp: new Date().toISOString()
      });
    } else {
      // Revalidate all tools pages
      await revalidatePath('/tools');
      
      // Get all tool IDs and revalidate their individual pages
      await connectDB();
      const tools = await Tool.find({}, { _id: 1 }).lean();
      
      for (const tool of tools) {
        await revalidatePath(`/tools/${(tool as any)._id.toString()}`);
      }
      
      return NextResponse.json({ 
        message: `All ${tools.length} tool pages revalidated successfully`,
        revalidated: true,
        count: tools.length,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check revalidation status
export async function GET() {
  return NextResponse.json({
    message: 'Tools revalidation endpoint is active',
    timestamp: new Date().toISOString(),
    usage: {
      POST: 'Trigger revalidation with { toolId?: string, secret: string }',
      endpoints: {
        'specific_tool': 'POST with toolId to revalidate single tool',
        'all_tools': 'POST without toolId to revalidate all tools'
      }
    }
  });
}
