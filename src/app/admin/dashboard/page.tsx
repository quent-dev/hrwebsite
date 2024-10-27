'use client';

import { WithPermission } from '../../../components/auth/with-permission';

export default function AdminDashboardPage() {
  return (
    <WithPermission 
      permission={(permissions) => permissions.canAccessAdminDashboard()}
      fallbackUrl="/dashboard"
    >
      <div>
        <h1>Admin Dashboard</h1>
        {/* Admin dashboard content */}
      </div>
    </WithPermission>
  );
}
