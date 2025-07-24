import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';
import { toolSchema } from '@/lib/validations/toolSchema';
import { handleError, validateRequest } from '@/lib/api-utils';
import { filterEmojisFromTags } from '@/lib/utils';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ toolId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const methodError = validateRequest(request, ['GET']);
  if (methodError) return methodError;

  try {
    await connectDB();
    
    const { toolId } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(toolId)) {
      return NextResponse.json(
        { error: `Invalid tool ID format: ${toolId}` },
        { status: 400 }
      );
    }

    const tool = await Tool.findById(toolId);
    
    if (!tool) {
      return NextResponse.json(
        { error: `Tool with ID ${toolId} is not found.` },
        { status: 404 }
      );
    }

    // Filter emojis from tags in the response
    const toolWithFilteredTags = {
      ...tool.toObject(),
      tags: filterEmojisFromTags(tool.tags)
    };

    return NextResponse.json({
      message: `${tool.title} is fetched.`,
      tool: toolWithFilteredTags
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const methodError = validateRequest(request, ['PUT']);
  if (methodError) return methodError;

  try {
    await connectDB();
    
    const { toolId } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(toolId)) {
      return NextResponse.json(
        { error: `Invalid tool ID format: ${toolId}` },
        { status: 400 }
      );
    }

    const tool = await Tool.findById(toolId);
    
    if (!tool) {
      return NextResponse.json(
        { error: `Tool with ID: ${toolId} not found.` },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Validate the request body (make all fields optional for updates)
    const partialToolSchema = toolSchema.partial();
    const validatedData = partialToolSchema.parse(body);

    const updatedTool = await Tool.findByIdAndUpdate(
      toolId,
      validatedData,
      { new: true, runValidators: true }
    );

    // Filter emojis from tags in the response
    const toolWithFilteredTags = {
      ...updatedTool.toObject(),
      tags: filterEmojisFromTags(updatedTool.tags)
    };

    return NextResponse.json({
      message: `Tool with ID: ${toolId} is updated.`,
      tool: toolWithFilteredTags
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const methodError = validateRequest(request, ['DELETE']);
  if (methodError) return methodError;

  try {
    await connectDB();
    
    const { toolId } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(toolId)) {
      return NextResponse.json(
        { error: `Invalid tool ID format: ${toolId}` },
        { status: 400 }
      );
    }

    const tool = await Tool.findById(toolId);
    
    if (!tool) {
      return NextResponse.json(
        { error: `Tool with ID: ${toolId} not found.` },
        { status: 404 }
      );
    }

    await Tool.findByIdAndDelete(toolId);

    return NextResponse.json({
      message: `Tool with ID: ${toolId} deleted.`
    });
  } catch (error) {
    return handleError(error);
  }
}
