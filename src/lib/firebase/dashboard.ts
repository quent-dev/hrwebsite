import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';
import { TimeOffRequest } from '../../types/time-off';
import { UserProfile } from '../../types/user';

export async function getPendingTimeOffCount(userId: string): Promise<number> {
  const q = query(
    collection(db, 'timeOffRequests'),
    where('userId', '==', userId),
    where('status', '==', 'pending')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
}

export async function getAvailableTimeOffCount(userId: string): Promise<number> {
  // Assuming a fixed number of vacation days for simplicity
  const totalVacationDays = 15; // This can be fetched from user profile if needed
  const usedVacationDays = await getUsedVacationDays(userId);
  return totalVacationDays - usedVacationDays;
}

export async function getUsedVacationDays(userId: string): Promise<number> {
  const q = query(
    collection(db, 'timeOffRequests'),
    where('userId', '==', userId),
    where('status', '==', 'approved'),
    where('type', '==', 'vacation')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.reduce((total, doc) => {
    const data = doc.data() as TimeOffRequest;
    const days = (data.endDate.toDate().getTime() - data.startDate.toDate().getTime()) / (1000 * 3600 * 24) + 1; // Calculate days
    return total + days;
  }, 0);
}

export async function getTeamMembersCount(managerId: string): Promise<number> {
  const q = query(
    collection(db, 'users'),
    where('employmentInfo.managerId', '==', managerId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
}
