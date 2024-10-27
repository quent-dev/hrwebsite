'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile, getUserProfile, updateUserProfile } from '../firebase/firestore';
import { UserProfile } from '../../types/user';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the ID token
        const token = await user.getIdToken();
        // Store it in a cookie
        Cookies.set('firebase-token', token, { secure: true, sameSite: 'strict' });
        
        // Get or create user profile
        let profile = await getUserProfile(user.uid);
        if (!profile) {
          await createUserProfile(user.uid, user.email || '');
          profile = await getUserProfile(user.uid);
        }
        
        setUser(user);
        setUserProfile(profile);
      } else {
        // Remove the token cookie when user is not authenticated
        Cookies.remove('firebase-token');
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    const updatedProfile = await getUserProfile(user.uid);
    setUserProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
