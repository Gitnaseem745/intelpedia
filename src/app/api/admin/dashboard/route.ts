import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tool from '@/models/Tool';
import PendingTool from '@/models/PendingTool';
import { handleError, validateRequest } from '@/lib/api-utils';
import { requireAdminAuth } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const methodError = validateRequest(request, ['GET']);
  if (methodError) return methodError;

  // Require admin authentication
  try {
    requireAdminAuth(request);
  } catch (authError) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin access required' },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    
    // Get current date and week start/end
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    
    // Get counts
    const [
      totalLiveTools,
      pendingSubmissions,
      approvedThisWeek,
      rejectedThisWeek,
      recentPendingTools,
      oldPendingTools,
      allTags
    ] = await Promise.all([
      Tool.countDocuments(),
      PendingTool.countDocuments({ status: 'pending' }),
      PendingTool.countDocuments({ 
        status: 'approved', 
        updatedAt: { $gte: weekStart } 
      }),
      PendingTool.countDocuments({ 
        status: 'rejected', 
        updatedAt: { $gte: weekStart } 
      }),
      PendingTool.find({ status: 'pending' })
        .sort({ submittedAt: -1 })
        .limit(5)
        .select('title submittedAt status'),
      PendingTool.countDocuments({ 
        status: 'pending',
        submittedAt: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) }
      }),
      Tool.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    // Check for categories with no tools
    const commonCategories = ['productivity', 'design', 'development', 'marketing', 'analytics'];
    const existingTags = allTags.map(tag => tag._id.toLowerCase());
    const missingCategories = commonCategories.filter(cat => 
      !existingTags.includes(cat)
    );

    // Prepare alerts
    const alerts = [];
    if (oldPendingTools > 0) {
      alerts.push({
        type: 'warning',
        message: `${oldPendingTools} tools pending for over 48 hours`,
        action: 'review-pending'
      });
    }
    if (missingCategories.length > 0) {
      alerts.push({
        type: 'info',
        message: `No tools in ${missingCategories[0]} category yet`,
        action: 'add-tool'
      });
    }

    return NextResponse.json({
      metrics: {
        totalLiveTools,
        pendingSubmissions,
        approvedThisWeek,
        rejectedThisWeek
      },
      recentActivity: recentPendingTools,
      alerts,
      topCategories: allTags.slice(0, 5)
    });
  } catch (error) {
    return handleError(error);
  }
}
