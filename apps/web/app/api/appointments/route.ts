import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments, members, staffs, services } from '@seoule/database/schema';
import { createAppointmentSchema } from '@seoule/database/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const staffId = searchParams.get('staffId');

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    if (status) {
      whereConditions.push(eq(appointments.status, status as any));
    }
    if (startDate) {
      whereConditions.push(gte(appointments.appointment_date, new Date(startDate)));
    }
    if (endDate) {
      whereConditions.push(lte(appointments.appointment_date, new Date(endDate)));
    }
    if (staffId) {
      whereConditions.push(eq(appointments.staff_id, staffId));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get appointments with related data
    const appointmentsData = await db
      .select({
        appointment_id: appointments.appointment_id,
        appointment_date: appointments.appointment_date,
        duration: appointments.duration,
        status: appointments.status,
        total_price: appointments.total_price,
        notes: appointments.notes,
        created_at: appointments.created_at,
        updated_at: appointments.updated_at,
        member: {
          member_id: members.member_id,
          full_name: members.full_name,
          phone: members.phone,
          email: members.email,
        },
        staff: {
          staff_id: staffs.staff_id,
          full_name: staffs.full_name,
          phone: staffs.phone,
          email: staffs.email,
          position: staffs.position,
        },
        service: {
          service_id: services.service_id,
          name: services.name,
          description: services.description,
          category: services.category,
          price: services.price,
        },
      })
      .from(appointments)
      .leftJoin(members, eq(appointments.member_id, members.member_id))
      .leftJoin(staffs, eq(appointments.staff_id, staffs.staff_id))
      .leftJoin(services, eq(appointments.service_id, services.service_id))
      .where(whereClause)
      .orderBy(desc(appointments.appointment_date))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: appointments.appointment_id })
      .from(appointments)
      .where(whereClause);

    return NextResponse.json({
      appointments: appointmentsData,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createAppointmentSchema.parse(body);
    
    // Create appointment
    const [newAppointment] = await db
      .insert(appointments)
      .values(validatedData)
      .returning();
    
    return NextResponse.json({
      message: '예약이 성공적으로 생성되었습니다.',
      appointment: newAppointment,
    }, { status: 201 });
  } catch (error) {
    console.error('Create appointment error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
