import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PendingTool from '@/models/PendingTool';
import { toolSchema } from '@/lib/validations/toolSchema';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the data using Zod schema
    const validationResult = toolSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Connect to MongoDB
    await connectDB();

    // Check if tool with same title already exists (including pending ones)
    const existingTool = await PendingTool.findOne({ 
      title: validatedData.title 
    });

    if (existingTool) {
      return NextResponse.json(
        { error: 'A tool with this title already exists or is pending review' },
        { status: 409 }
      );
    }

    // Create new pending tool
    const pendingTool = new PendingTool({
      title: validatedData.title,
      description: validatedData.description,
      tags: validatedData.tags || [],
      siteUrl: validatedData.siteUrl,
      imgUrl: validatedData.imgUrl || '/images/placeholder.webp',
      features: validatedData.features || [],
      isFree: validatedData.isFree,
      pricing: validatedData.pricing,
      status: 'pending',
      submittedAt: new Date()
    });

    // Save to database
    await pendingTool.save();

    return NextResponse.json(
      { 
        message: 'Tool submitted for review successfully!',
        id: pendingTool._id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error submitting tool:', error);
    
    // Handle duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A tool with this title already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
