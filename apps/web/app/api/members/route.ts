import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { members } from '@/db/schema/members';
import { eq, desc } from 'drizzle-orm';
import { createMemberSchema } from '@/db/schema/members';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const allMembers = await db
      .select()
      .from(members)
      .orderBy(desc(members.created_at))
      .limit(limit)
      .offset(offset);

    const totalCount = await db.select().from(members);

    return NextResponse.json({
      data: allMembers,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        pages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMemberSchema.parse(body);

    const newMember = await db
      .insert(members)
      .values(validatedData)
      .returning();

    return NextResponse.json(newMember[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 400 }
    );
  }
}
