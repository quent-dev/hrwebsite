'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/context/auth-context";
import { getPendingTimeOffRequests, updateTimeOffStatus } from "../../lib/firebase/time-off";
import { TimeOffRequest } from "../../types/time-off";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useToast } from "../../../hooks/use-toast";

export function ManagerTimeOffRequests() {
  const { userProfile } = useAuth();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      if (userProfile) {
        const pendingRequests = await getPendingTimeOffRequests(userProfile.uid);
        setRequests(pendingRequests);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [userProfile]);

  const handleApprove = async (requestId: string) => {
    if (!userProfile) return;
    try {
      await updateTimeOffStatus(requestId, 'approved', userProfile.uid);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast({
        title: "Request Approved",
        description: "The time off request has been approved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error approving the request.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    if (!userProfile) return;
    try {
      await updateTimeOffStatus(requestId, 'rejected', userProfile.uid);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast({
        title: "Request Rejected",
        description: "The time off request has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error rejecting the request.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Time Off Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending requests to display.</p>
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
                <div className="flex space-x-2 mt-2">
                  <Button onClick={() => handleApprove(request.id)}>Approve</Button>
                  <Button variant="destructive" onClick={() => handleReject(request.id)}>Reject</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
