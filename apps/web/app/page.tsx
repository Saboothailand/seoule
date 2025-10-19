import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function HomePage() {
  const user = await getCurrentUser();
  
  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            Seoule Nail Salon
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Professional nail art services with our advanced CRM system
          </p>
          
          <div className="space-x-4">
            <Link 
              href="/login"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200"
            >
              로그인
            </Link>
            <Link 
              href="/about"
              className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg border border-gray-300 transition duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



