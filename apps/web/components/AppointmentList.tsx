'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Appointment {
  appointment_id: string;
  appointment_date: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  total_price: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
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

interface AppointmentListProps {
  limit?: number;
  showPagination?: boolean;
}

export default function AppointmentList({ limit = 10, showPagination = true }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAppointments = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      if (response.ok) {
        setAppointments(data.appointments);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      } else {
        setError(data.error || '예약 목록을 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '예약됨';
      case 'confirmed':
        return '확정됨';
      case 'in_progress':
        return '진행중';
      case 'completed':
        return '완료됨';
      case 'cancelled':
        return '취소됨';
      case 'no_show':
        return '노쇼';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => fetchAppointments()}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">예약 목록</h2>
        <Link
          href="/appointments/new"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm"
        >
          새 예약 만들기
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          예약이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.appointment_id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">
                      {appointment.member.full_name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">서비스:</span> {appointment.service.name}
                    </div>
                    <div>
                      <span className="font-medium">직원:</span> {appointment.staff.full_name} ({appointment.staff.position})
                    </div>
                    <div>
                      <span className="font-medium">일시:</span> {formatDate(appointment.appointment_date)}
                    </div>
                    <div>
                      <span className="font-medium">소요시간:</span> {formatDuration(appointment.duration)}
                    </div>
                    {appointment.total_price && (
                      <div>
                        <span className="font-medium">가격:</span> ฿{parseFloat(appointment.total_price).toLocaleString()}
                      </div>
                    )}
                    {appointment.notes && (
                      <div>
                        <span className="font-medium">메모:</span> {appointment.notes}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    href={`/appointments/${appointment.appointment_id}`}
                    className="text-pink-600 hover:text-pink-700 text-sm"
                  >
                    상세보기
                  </Link>
                  <Link
                    href={`/appointments/${appointment.appointment_id}/edit`}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    편집
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => fetchAppointments(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => fetchAppointments(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
