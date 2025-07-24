import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
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

    // Find and update the tool status to 'rejected' in pending-tools collection
    const rejectedTool = await PendingTool.findByIdAndUpdate(
      toolId, 
      { status: 'rejected' }, 
      { new: true }
    );
    
    if (!rejectedTool) {
      return NextResponse.json(
        { error: 'Pending tool not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Tool rejected successfully',
      rejectedTool: {
        _id: rejectedTool._id,
        title: rejectedTool.title,
        status: rejectedTool.status
      }
    });

  } catch (error) {
    console.error('Error rejecting tool:', error);
    return handleError(error);
  }
}
