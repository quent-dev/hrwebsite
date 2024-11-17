'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TimeOffRequest } from "@/src/types/time-off"

interface RequestDetailsDialogProps {
  request: TimeOffRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestDetailsDialog({ request, open, onOpenChange }: RequestDetailsDialogProps) {
  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Time Off Request Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Type</p>
            <p className="text-sm text-muted-foreground">{request.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground">{request.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Dates</p>
            <p className="text-sm text-muted-foreground">
              {request.startDate.toDate().toLocaleDateString()} - {request.endDate.toDate().toLocaleDateString()}
            </p>
          </div>
          {request.reason && (
            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">{request.reason}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RequestDetailsDialog 