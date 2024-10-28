'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { usePermissions } from "../../lib/utils/permissions";
import { CalendarDays, Clock, Users } from "lucide-react";
import { getPendingTimeOffCount, getAvailableTimeOffCount, getTeamMembersCount } from "../../lib/firebase/dashboard";
import { TimeOffRequestsList } from "../../components/time-off/time-off-requests-list";
import { ManagerTimeOffRequests } from "../../components/time-off/manager-time-off-requests";

export function DashboardLayout() {
  const { userProfile } = useAuth();
  const permissions = usePermissions(userProfile);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [availableDays, setAvailableDays] = useState(0);
  const [teamMembers, setTeamMembers] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (userProfile) {
        try {
          const pendingCount = await getPendingTimeOffCount(userProfile.uid);
          const availableCount = await getAvailableTimeOffCount(userProfile.uid);
          setPendingRequests(pendingCount);
          setAvailableDays(availableCount);

          if (permissions.canAccessManagerDashboard()) {
            const teamCount = await getTeamMembersCount(userProfile.uid);
            setTeamMembers(teamCount);
          }
        } catch (error) {
          console.error('Error fetching metrics:', error);
          // Optionally show a toast or other error UI
        }
      }
    };

    fetchMetrics();
  }, [userProfile, permissions]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Time Off
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests} days</div>
            <p className="text-xs text-muted-foreground">
              Pending requests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Time Off
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableDays} days</div>
            <p className="text-xs text-muted-foreground">
              Vacation days remaining
            </p>
          </CardContent>
        </Card>
        {permissions.canAccessManagerDashboard() && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers}</div>
              <p className="text-xs text-muted-foreground">
                Direct reports
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Time Off Requests</TabsTrigger>
          {permissions.canAccessManagerDashboard() && (
            <TabsTrigger value="team">Team Calendar</TabsTrigger>
          )}
          {permissions.canAccessAdminDashboard() && (
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No recent activity to display.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests" className="space-y-4">
          {permissions.canAccessManagerDashboard() ? (
            <ManagerTimeOffRequests />
          ) : (
            <TimeOffRequestsList />
          )}
        </TabsContent>
        {permissions.canAccessManagerDashboard() && (
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No team calendar events to display.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {permissions.canAccessAdminDashboard() && (
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No users to display.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
