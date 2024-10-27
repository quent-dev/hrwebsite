import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { UserProfile } from '../../types/user';

const USERS_COLLECTION = 'users';

export async function createUserProfile(uid: string, email: string): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  
  const defaultProfile: UserProfile = {
    uid,
    email,
    displayName: '',
    role: 'employee',
    personalInfo: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: null,
      address: '',
    },
    employmentInfo: {
      employeeId: '',
      department: '',
      position: '',
      startDate: null,
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: '',
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await setDoc(userRef, defaultProfile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  
  return null;
}

export async function updateUserProfile(
  uid: string, 
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function getUsersByManager(managerId: string): Promise<UserProfile[]> {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(
    usersRef, 
    where('employmentInfo.managerId', '==', managerId)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as UserProfile);
}
