import { UserProfile } from '../../types/user';

export const Permissions = {
  // User role checks
  isAdmin: (userProfile: UserProfile | null): boolean => {
    return userProfile?.role === 'admin';
  },

  isManager: (userProfile: UserProfile | null): boolean => {
    return userProfile?.role === 'manager';
  },

  isEmployee: (userProfile: UserProfile | null): boolean => {
    return userProfile?.role === 'employee';
  },

  // Specific permission checks
  canManageUsers: (userProfile: UserProfile | null): boolean => {
    return userProfile?.role === 'admin';
  },

  canViewProfile: (userProfile: UserProfile | null, targetUserId: string): boolean => {
    if (!userProfile) return false;
    
    return (
      userProfile.uid === targetUserId || // Own profile
      userProfile.role === 'admin' || // Admin can view all
      (userProfile.role === 'manager' && isUserManager(userProfile.uid, targetUserId)) // Manager viewing team member
    );
  },

  canEditProfile: (userProfile: UserProfile | null, targetUserId: string): boolean => {
    if (!userProfile) return false;

    return (
      userProfile.uid === targetUserId || // Own profile
      userProfile.role === 'admin' // Admin can edit all
    );
  },

  canEditEmploymentInfo: (userProfile: UserProfile | null, targetUserId: string): boolean => {
    if (!userProfile) return false;

    return (
      userProfile.role === 'admin' ||
      (userProfile.role === 'manager' && isUserManager(userProfile.uid, targetUserId))
    );
  },

  canApproveTimeOff: (userProfile: UserProfile | null, targetUserId: string): boolean => {
    if (!userProfile) return false;

    return (
      userProfile.role === 'admin' ||
      (userProfile.role === 'manager' && isUserManager(userProfile.uid, targetUserId))
    );
  },

  canViewTeamCalendar: (userProfile: UserProfile | null): boolean => {
    return userProfile?.role === 'manager' || userProfile?.role === 'admin';
  },

  canAccessAdminDashboard: (userProfile: UserProfile | null): boolean => {
    return userProfile?.role === 'admin';
  },

  canAccessManagerDashboard: (userProfile: UserProfile | null): boolean => {
    return userProfile?.role === 'manager' || userProfile?.role === 'admin';
  }
};

// Helper function to check if a user is manager of another user
function isUserManager(managerId: string, employeeId: string): boolean {
  // This would typically involve a database check
  // For now, we'll rely on the client-side data
  // In a real application, you might want to cache this or check against Firestore
  return true; // Placeholder - implement actual logic
}

// Custom hook for checking permissions
export function usePermissions(userProfile: UserProfile | null) {
  return {
    isAdmin: () => Permissions.isAdmin(userProfile),
    isManager: () => Permissions.isManager(userProfile),
    isEmployee: () => Permissions.isEmployee(userProfile),
    canManageUsers: () => Permissions.canManageUsers(userProfile),
    canViewProfile: (targetUserId: string) => Permissions.canViewProfile(userProfile, targetUserId),
    canEditProfile: (targetUserId: string) => Permissions.canEditProfile(userProfile, targetUserId),
    canEditEmploymentInfo: (targetUserId: string) => Permissions.canEditEmploymentInfo(userProfile, targetUserId),
    canApproveTimeOff: (targetUserId: string) => Permissions.canApproveTimeOff(userProfile, targetUserId),
    canViewTeamCalendar: () => Permissions.canViewTeamCalendar(userProfile),
    canAccessAdminDashboard: () => Permissions.canAccessAdminDashboard(userProfile),
    canAccessManagerDashboard: () => Permissions.canAccessManagerDashboard(userProfile),
  };
}
