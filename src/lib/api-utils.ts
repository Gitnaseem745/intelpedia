import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    // MongoDB duplicate key error
    if (error.message.includes('E11000')) {
      return NextResponse.json(
        { error: 'A tool with this title already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export function validateRequest(request: NextRequest, allowedMethods: string[]) {
  if (!allowedMethods.includes(request.method!)) {
    return NextResponse.json(
      { error: `Method ${request.method} not allowed` },
      { status: 405 }
    );
  }
  return null;
}
