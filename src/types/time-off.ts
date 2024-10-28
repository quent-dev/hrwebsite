import { Timestamp } from 'firebase/firestore';

export type TimeOffType = 'vacation' | 'sick' | 'personal' | 'extra';
export type TimeOffStatus = 'pending' | 'approved' | 'rejected';

export interface TimeOffRequest {
  id: string;
  userId: string;
  type: TimeOffType;
  startDate: Timestamp;
  endDate: Timestamp;
  reason: string;
  status: TimeOffStatus;
  approvedBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
