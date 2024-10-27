'use client';

import { useAuth } from '../../lib/context/auth-context';
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">{user.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
