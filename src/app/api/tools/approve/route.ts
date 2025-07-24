import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';
import PendingTool from '@/models/PendingTool';
import { handleError, validateRequest } from '@/lib/api-utils';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  const methodError = validateRequest(request, ['POST']);
  if (methodError) return methodError;

  try {
    await connectDB();
    
    const body = await request.json();
    const { toolId } = body;

    if (!toolId) {
      return NextResponse.json(
        { error: 'Tool ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(toolId)) {
      return NextResponse.json(
        { error: 'Invalid tool ID format' },
        { status: 400 }
      );
    }

    // Find the tool in pending-tools collection
    const pendingTool = await PendingTool.findById(toolId);
    
    if (!pendingTool) {
      return NextResponse.json(
        { error: 'Pending tool not found' },
        { status: 404 }
      );
    }

    // Check if a tool with the same title already exists in the main collection
    const existingTool = await Tool.findOne({ title: pendingTool.title });
    if (existingTool) {
      return NextResponse.json(
        { error: 'A tool with this title already exists in the main collection' },
        { status: 409 }
      );
    }

    // Create new tool in the main tools collection
    const newTool = new Tool({
      title: pendingTool.title,
      description: pendingTool.description,
      tags: pendingTool.tags,
      siteUrl: pendingTool.siteUrl,
      imgUrl: pendingTool.imgUrl,
      features: pendingTool.features,
      featured: pendingTool.featured || false,
      isFree: pendingTool.isFree,
      pricing: pendingTool.pricing
    });

    await newTool.save();

    // Update the status of the tool in pending-tools collection to 'approved'
    await PendingTool.findByIdAndUpdate(toolId, { status: 'approved' });

    return NextResponse.json({
      message: 'Tool approved and moved to main collection successfully',
      tool: newTool
    });

  } catch (error) {
    console.error('Error approving tool:', error);
    return handleError(error);
  }
}
