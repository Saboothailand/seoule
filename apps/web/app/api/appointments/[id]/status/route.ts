import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments } from '@seoule/database/schema';
import { appointmentStatusUpdateSchema } from '@seoule/database/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;
    const body = await request.json();
    
    // Validate input
    const validatedData = appointmentStatusUpdateSchema.parse(body);
    
    // Update appointment status
    const [updatedAppointment] = await db
      .update(appointments)
      .set({
        status: validatedData.status,
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
      message: '예약 상태가 성공적으로 업데이트되었습니다.',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    
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
