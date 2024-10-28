import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentReference,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { TimeOffRequest, TimeOffStatus } from '../../types/time-off';
import { UserProfile } from '../../types/user';
import { getAuth } from 'firebase/auth';

const TIME_OFF_COLLECTION = 'timeOffRequests';

export async function createTimeOffRequest(
  userId: string,
  data: Omit<TimeOffRequest, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  
  const timeOffData: Omit<TimeOffRequest, 'id'> = {
    userId,
    ...data,
    status: 'pending',
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any
  };

  try {
    const docRef = await addDoc(collection(db, TIME_OFF_COLLECTION), timeOffData);
    return docRef.id;
  } catch (error) {
    console.error('Error in createTimeOffRequest:', error);
    throw error;
  }
}

export async function getTimeOffRequest(id: string): Promise<TimeOffRequest | null> {
  const docRef = doc(db, TIME_OFF_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as TimeOffRequest;
  }
  
  return null;
}

export async function getUserTimeOffRequests(userId: string): Promise<TimeOffRequest[]> {
  const q = query(
    collection(db, TIME_OFF_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as TimeOffRequest));
}

export async function getPendingTimeOffRequests(managerId: string): Promise<TimeOffRequest[]> {
  // First, get all users that report to this manager
  const usersQuery = query(
    collection(db, 'users'),
    where('employmentInfo.managerId', '==', managerId)
  );
  const userSnapshots = await getDocs(usersQuery);
  const teamUserIds = userSnapshots.docs.map(doc => doc.id);

  // Then get all pending requests for these users
  const q = query(
    collection(db, TIME_OFF_COLLECTION),
    where('userId', 'in', teamUserIds),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as TimeOffRequest));
}

export async function updateTimeOffStatus(
  requestId: string,
  status: TimeOffStatus,
  approvedBy?: string
): Promise<void> {
  const docRef = doc(db, TIME_OFF_COLLECTION, requestId);
  await updateDoc(docRef, {
    status,
    approvedBy,
    updatedAt: Timestamp.now(),
  });
}

export async function getOverlappingTimeOffRequests(
  startDate: Date,
  endDate: Date,
  userId: string,
  excludeRequestId?: string
): Promise<TimeOffRequest[]> {
  const q = query(
    collection(db, TIME_OFF_COLLECTION),
    where('userId', '==', userId),
    where('status', 'in', ['pending', 'approved']),
    where('startDate', '<=', Timestamp.fromDate(endDate)),
    where('endDate', '>=', Timestamp.fromDate(startDate))
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .filter(doc => doc.id !== excludeRequestId)
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TimeOffRequest));
}

export async function getTeamTimeOffRequests(
  managerId: string,
  startDate: Date,
  endDate: Date
): Promise<TimeOffRequest[]> {
  // Get team members
  const usersQuery = query(
    collection(db, 'users'),
    where('employmentInfo.managerId', '==', managerId)
  );
  const userSnapshots = await getDocs(usersQuery);
  const teamUserIds = userSnapshots.docs.map(doc => doc.id);

  // Get approved time off requests for the team
  const q = query(
    collection(db, TIME_OFF_COLLECTION),
    where('userId', 'in', teamUserIds),
    where('status', '==', 'approved'),
    where('startDate', '<=', Timestamp.fromDate(endDate)),
    where('endDate', '>=', Timestamp.fromDate(startDate))
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as TimeOffRequest));
}
