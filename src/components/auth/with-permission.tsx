'use client';

import { useAuth } from '../../lib/context/auth-context';
import { usePermissions } from '../../lib/utils/permissions';
import { redirect } from 'next/navigation';

interface WithPermissionProps {
  children: React.ReactNode;
  permission: (permissions: ReturnType<typeof usePermissions>) => boolean;
  fallbackUrl?: string;
}

export function WithPermission({ 
  children, 
  permission,
  fallbackUrl = '/'
}: WithPermissionProps) {
  const { userProfile, loading } = useAuth();
  const permissions = usePermissions(userProfile);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!permission(permissions)) {
    redirect(fallbackUrl);
  }

  return <>{children}</>;
}
