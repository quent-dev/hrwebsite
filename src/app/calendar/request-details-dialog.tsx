'use client'

import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface TimeOffRequest {
  id: string
  userName: string
  type: string
  startDate: any // Firestore Timestamp
  endDate: any // Firestore Timestamp
  description: string
  status: 'approved' | 'pending' | 'rejected'
}

interface RequestDetailsDialogProps {
  request: TimeOffRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RequestDetailsDialog({ 
  request, 
  open, 
  onOpenChange 
}: RequestDetailsDialogProps) {
  if (!request) return null

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Time Off Request Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Employee:</span>
            <span className="col-span-3">{request.userName}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Type:</span>
            <span className="col-span-3">{request.type}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Dates:</span>
            <span className="col-span-3">
              {format(request.startDate.toDate(), 'PPP')} - {format(request.endDate.toDate(), 'PPP')}
            </span>
          </div>
          {request.description && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Description:</span>
              <span className="col-span-3">{request.description}</span>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold">Status:</span>
            <Badge className={`${getStatusColor(request.status)} col-span-3 w-fit`}>
              {request.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 