'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppointmentForm from '@/components/AppointmentForm';

interface Appointment {
  appointment_id: string;
  appointment_date: string;
  duration: number;
  status: string;
  total_price: string | null;
  notes: string | null;
  member: {
    member_id: string;
    full_name: string;
    phone: string;
    email: string | null;
  };
  staff: {
    staff_id: string;
    full_name: string;
    phone: string;
    email: string;
    position: string;
  };
  service: {
    service_id: string;
    name: string;
    description: string | null;
    category: string;
    price: string;
  };
}

export default function EditAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchAppointment(params.id as string);
    }
  }, [params.id]);

  const fetchAppointment = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setAppointment(data.appointment);
      } else {
        setError(data.error || '예약을 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || '예약을 찾을 수 없습니다.'}</div>
          <button
            onClick={() => router.back()}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const initialData = {
    member_id: appointment.member.member_id,
    staff_id: appointment.staff.staff_id,
    service_id: appointment.service.service_id,
    appointment_date: new Date(appointment.appointment_date).toISOString().slice(0, 16),
    duration: appointment.duration,
    notes: appointment.notes || '',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <AppointmentForm
            appointmentId={appointment.appointment_id}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}
