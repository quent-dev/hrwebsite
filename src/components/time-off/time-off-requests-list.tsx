'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/context/auth-context";
import { getUserTimeOffRequests } from "../../lib/firebase/time-off";
import { TimeOffRequest } from "../../types/time-off";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export function TimeOffRequestsList() {
  const { userProfile } = useAuth();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (userProfile) {
        const userRequests = await getUserTimeOffRequests(userProfile.uid);
        setRequests(userRequests);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [userProfile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Time Off Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No time off requests to display.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request) => (
              <li key={request.id} className="border p-4 rounded-md">
                <h3 className="font-bold">{request.type}</h3>
                <p>
                  {request.startDate.toDate().toLocaleDateString()} - {request.endDate.toDate().toLocaleDateString()}
                </p>
                <p>Status: {request.status}</p>
                <p>Reason: {request.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
