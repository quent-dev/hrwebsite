'use client';

import { useAuth } from '../../lib/context/auth-context';
import { redirect } from 'next/navigation';

export default function TimeOffPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Time Off Requests</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Time off request form coming soon...</p>
      </div>
    </div>
  );
}
