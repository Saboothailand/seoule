import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/db/schema/services';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = db.select().from(services).where(eq(services.is_active, true));

    if (category) {
      query = query.where(eq(services.category, category));
    }

    const allServices = await query;

    return NextResponse.json({ data: allServices });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}



