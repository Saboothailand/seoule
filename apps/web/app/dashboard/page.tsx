import MemberList from '@/components/MemberList';
import StaffList from '@/components/StaffList';
import AddMemberForm from '@/components/AddMemberForm';
import Navigation from '@/components/Navigation';
import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await requireAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Nail Salon CRM Dashboard
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <MemberList />
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white shadow rounded-lg">
                <AddMemberForm />
              </div>
              
              <div className="bg-white shadow rounded-lg">
                <StaffList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
