import Navigation from '@/components/Navigation';
import AppointmentForm from '@/components/AppointmentForm';
import { requireAuth } from '@/lib/auth';

export default async function NewAppointmentPage() {
  await requireAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <AppointmentForm />
        </div>
      </div>
    </div>
  );
}
