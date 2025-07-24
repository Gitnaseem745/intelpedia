import { NextRequest, NextResponse } from 'next/server';
import { handleError, validateRequest } from '@/lib/api-utils';
import { bulkCreateTools } from '@/lib/utils/bulkCreate';

export async function POST(request: NextRequest) {
  const methodError = validateRequest(request, ['POST']);
  if (methodError) return methodError;

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'bulk-create') {
      const result = await bulkCreateTools();
      
      if (result.success) {
        return NextResponse.json(result, { status: 200 });
      } else {
        return NextResponse.json(result, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported actions: bulk-create' },
      { status: 400 }
    );
  } catch (error) {
    return handleError(error);
  }
}
