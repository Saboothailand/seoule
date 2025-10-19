import StaffList from '@/components/StaffList';
import Navigation from '@/components/Navigation';
import { requireAuth } from '@/lib/auth';

export default async function StaffPage() {
  await requireAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Staff
          </h1>
          <StaffList />
        </div>
      </div>
    </div>
  );
}



