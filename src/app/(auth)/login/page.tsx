'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogleAndHandlePreregistered } from '../../../lib/firebase/auth';
import { toast } from 'sonner';
import Image from 'next/image'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogleAndHandlePreregistered();
      console.log('Successfully signed in:', result.user.email);
      toast.success('Successfully signed in!');
      router.push('/');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to HR Portal</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Please sign in to continue</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <Image 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            width={20}
            height={20}
            className="w-5 h-5"
          />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
