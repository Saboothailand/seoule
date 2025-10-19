'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  const updateStatus = async (newStatus: string) => {
    if (!appointment) return;
    
    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/appointments/${appointment.appointment_id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAppointment(prev => prev ? { ...prev, status: newStatus as any } : null);
      } else {
        setError(data.error || '상태 업데이트에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setUpdatingStatus(false);
    }
  };

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
          <Link
            href="/appointments"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md"
          >
            예약 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">예약 상세</h1>
            <div className="flex space-x-4">
              <Link
                href={`/appointments/${appointment.appointment_id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                편집
              </Link>
              <Link
                href="/appointments"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                목록으로
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {appointment.member.full_name}님의 예약
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {getStatusText(appointment.status)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">고객 정보</h3>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">이름:</span> {appointment.member.full_name}
                    </div>
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">전화번호:</span> {appointment.member.phone}
                    </div>
                    {appointment.member.email && (
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">이메일:</span> {appointment.member.email}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">담당 직원</h3>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">이름:</span> {appointment.staff.full_name}
                    </div>
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">직책:</span> {appointment.staff.position}
                    </div>
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">전화번호:</span> {appointment.staff.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">서비스 정보</h3>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">서비스:</span> {appointment.service.name}
                    </div>
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">카테고리:</span> {appointment.service.category}
                    </div>
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">가격:</span> ฿{parseFloat(appointment.service.price).toLocaleString()}
                    </div>
                    {appointment.service.description && (
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">설명:</span> {appointment.service.description}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">예약 정보</h3>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">예약 일시:</span> {formatDate(appointment.appointment_date)}
                    </div>
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">소요시간:</span> {formatDuration(appointment.duration)}
                    </div>
                    {appointment.total_price && (
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">총 가격:</span> ฿{parseFloat(appointment.total_price).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {appointment.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">메모</h3>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {appointment.notes}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">상태 변경</h3>
                <div className="flex flex-wrap gap-2">
                  {['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(status)}
                      disabled={updatingStatus || appointment.status === status}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        appointment.status === status
                          ? 'bg-pink-100 text-pink-800 cursor-default'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
