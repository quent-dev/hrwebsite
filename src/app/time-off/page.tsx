'use client';

import { useAuth } from '../../lib/context/auth-context';
import { redirect } from 'next/navigation';
import { TimeOffForm } from '../../components/time-off/time-off-form';

export default function TimeOffPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Request Time Off</h1>
      <TimeOffForm />
    </div>
  );
}
