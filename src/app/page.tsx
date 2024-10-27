'use client';

import { useAuth } from '../lib/context/auth-context';
import { auth } from '../lib/firebase/config';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">HR Website</h1>
      {user ? (
        <div>
          <p className="mb-4">Welcome, {user.email}</p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <Link 
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </Link>
      )}
    </div>
  );
}