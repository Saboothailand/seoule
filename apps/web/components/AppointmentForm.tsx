'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Member {
  member_id: string;
  full_name: string;
  phone: string;
  email: string | null;
}

interface Staff {
  staff_id: string;
  full_name: string;
  phone: string;
  email: string;
  position: string;
}

interface Service {
  service_id: string;
  name: string;
  description: string | null;
  category: string;
  price: string;
  duration: number;
}

interface AppointmentFormProps {
  appointmentId?: string;
  initialData?: {
    member_id: string;
    staff_id: string;
    service_id: string;
    appointment_date: string;
    duration: number;
    notes: string;
  };
}

export default function AppointmentForm({ appointmentId, initialData }: AppointmentFormProps) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    member_id: initialData?.member_id || '',
    staff_id: initialData?.staff_id || '',
    service_id: initialData?.service_id || '',
    appointment_date: initialData?.appointment_date || '',
    duration: initialData?.duration || 60,
    notes: initialData?.notes || '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, staffRes, servicesRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/staff'),
        fetch('/api/services'),
      ]);

      const [membersData, staffData, servicesData] = await Promise.all([
        membersRes.json(),
        staffRes.json(),
        servicesRes.json(),
      ]);

      if (membersRes.ok) setMembers(membersData.members || []);
      if (staffRes.ok) setStaff(staffData.staff || []);
      if (servicesRes.ok) setServices(servicesData.services || []);
    } catch (err) {
      setError('데이터를 불러올 수 없습니다.');
    }
  };

  const handleServiceChange = (serviceId: string) => {
    const selectedService = services.find(s => s.service_id === serviceId);
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        service_id: serviceId,
        duration: selectedService.duration,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = appointmentId ? `/api/appointments/${appointmentId}` : '/api/appointments';
      const method = appointmentId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/appointments');
        router.refresh();
      } else {
        setError(data.error || '예약 저장에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {appointmentId ? '예약 수정' : '새 예약 만들기'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="member_id" className="block text-sm font-medium text-gray-700 mb-2">
              고객 *
            </label>
            <select
              id="member_id"
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">고객을 선택하세요</option>
              {members.map((member) => (
                <option key={member.member_id} value={member.member_id}>
                  {member.full_name} ({member.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700 mb-2">
              담당 직원 *
            </label>
            <select
              id="staff_id"
              name="staff_id"
              value={formData.staff_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">직원을 선택하세요</option>
              {staff.map((s) => (
                <option key={s.staff_id} value={s.staff_id}>
                  {s.full_name} ({s.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="service_id" className="block text-sm font-medium text-gray-700 mb-2">
              서비스 *
            </label>
            <select
              id="service_id"
              name="service_id"
              value={formData.service_id}
              onChange={(e) => {
                handleChange(e);
                handleServiceChange(e.target.value);
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">서비스를 선택하세요</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {service.name} - ฿{parseFloat(service.price).toLocaleString()} ({service.duration}분)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-2">
              예약 일시 *
            </label>
            <input
              type="datetime-local"
              id="appointment_date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              소요시간 (분) *
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="15"
              step="15"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            메모
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="예약 관련 특이사항이나 요청사항을 입력하세요"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '저장 중...' : (appointmentId ? '수정' : '생성')}
          </button>
        </div>
      </form>
    </div>
  );
}
