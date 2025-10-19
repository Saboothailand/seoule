import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { staffs } from '@/db/schema/staffs';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allStaff = await db
      .select()
      .from(staffs)
      .orderBy(desc(staffs.created_at));

    return NextResponse.json({ data: allStaff });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}



