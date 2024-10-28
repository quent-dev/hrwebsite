'use client';

import { useAuth } from '../lib/context/auth-context';
import { auth } from '../lib/firebase/config';
import { DashboardLayout } from '../components/dashboard/dashboard-layout';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to HR Portal</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Please sign in to access your dashboard
        </p>
        <Link
          href="/login"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return <DashboardLayout />;
}
