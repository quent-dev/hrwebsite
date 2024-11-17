'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TimeOffRequest } from "@/src/types/time-off"

interface RequestDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  request: TimeOffRequest | null
}

export function RequestDetailsDialog({ isOpen, onClose, request }: RequestDetailsDialogProps) {
  if (!request) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
            </p>
          </div>
          {request.notes && (
            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">{request.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RequestDetailsDialog 