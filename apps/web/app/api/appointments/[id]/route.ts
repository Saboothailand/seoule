import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments, members, staffs, services } from '@seoule/database/schema';
import { updateAppointmentSchema, appointmentStatusUpdateSchema } from '@seoule/database/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;

    const [appointment] = await db
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
      .where(eq(appointments.appointment_id, appointmentId))
      .limit(1);

    if (!appointment) {
      return NextResponse.json(
        { error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;
    const body = await request.json();
    
    // Validate input
    const validatedData = updateAppointmentSchema.parse(body);
    
    // Update appointment
    const [updatedAppointment] = await db
      .update(appointments)
      .set({
        ...validatedData,
        updated_at: new Date(),
      })
      .where(eq(appointments.appointment_id, appointmentId))
      .returning();
    
    if (!updatedAppointment) {
      return NextResponse.json(
        { error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: '예약이 성공적으로 업데이트되었습니다.',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;
    
    // Delete appointment
    const [deletedAppointment] = await db
      .delete(appointments)
      .where(eq(appointments.appointment_id, appointmentId))
      .returning();
    
    if (!deletedAppointment) {
      return NextResponse.json(
        { error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: '예약이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
