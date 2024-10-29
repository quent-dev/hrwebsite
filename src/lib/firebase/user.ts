import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

export async function getUserRole(uid: string): Promise<string | null> {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    return userData?.role || null; // Assuming 'role' is a field in the user document
  }

  return null;
}

export async function getUserInfo(uid: string): Promise<{ displayName: string | null; firstName: string | null; lastName: string | null } | null> {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    return {
      displayName: userData?.displayName || null,
      firstName: userData?.firstName || null,
      lastName: userData?.lastName || null,
    };
  }

  return null;
}



