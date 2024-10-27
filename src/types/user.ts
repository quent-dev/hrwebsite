import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'employee' | 'manager' | 'admin';
  personalInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: Timestamp | null;
    address: string;
  };
  employmentInfo: {
    employeeId: string;
    department: string;
    position: string;
    startDate: Timestamp | null;
    managerId?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  profileImageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type UserProfileFormData = Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'updatedAt'>;
