'use client'

import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog"
import { Badge } from "../../../components/ui/badge"
import { Timestamp } from 'firebase/firestore'

interface TimeOffRequest {
  id: string
  userName: string
  userId: string
  type: string
  startDate: Timestamp
  endDate: Timestamp
  reason: string
  status: 'approved' | 'pending' | 'rejected'
  approvedBy?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface RequestDetailsDialogProps {
  request: TimeOffRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getDate = (date: Date | Timestamp) => {
  if (date instanceof Date) return date;
  return date.toDate();
}

export default function RequestDetailsDialog({ 
  request, 
  open, 
  onOpenChange 
}: RequestDetailsDialogProps) {
  console.log('Dialog props:', { request, open, onOpenChange });
  
  if (!request) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 hover:bg-green-600'
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-background sm:max-w-[425px] border shadow-lg z-[100]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-foreground">Time Off Request Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View the details of this time off request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold text-foreground">Employee:</span>
            <span className="col-span-3 text-foreground">{request.userName}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold text-foreground">Type:</span>
            <span className="col-span-3 text-foreground">{request.type}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold text-foreground">Dates:</span>
            <span className="col-span-3 text-foreground">
              {format(getDate(request.startDate), 'PPP')} - {format(getDate(request.endDate), 'PPP')}
            </span>
          </div>
          {request.reason && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold text-foreground">Description:</span>
              <span className="col-span-3 text-foreground">{request.reason}</span>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold text-foreground">Status:</span>
            <Badge className={`${getStatusColor(request.status)} col-span-3 w-fit`}>
              {request.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </DialogContent>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90]" aria-hidden="true" />
    </Dialog>
  )
} 