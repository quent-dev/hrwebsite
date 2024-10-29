'use client'

import { useState, useEffect } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer, View, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase/config'
import { useAuth } from '../../lib/context/auth-context'
import RequestDetailsDialog from './request-details-dialog'
import './calendar.css'
import { getUserInfo, getUserRole } from '../../lib/firebase/user'
import { addDays } from 'date-fns'

const locales = {
  'en-US': require('date-fns/locale/en-US'),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  request: Record<string, any>
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Record<string, any> | null>(null)
  const { user } = useAuth()
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return

      try {
        let timeOffQuery
        const role = await getUserRole(user.uid)

        switch (role) {
          case 'employee':
            timeOffQuery = query(
              collection(db, 'timeOffRequests'),
              where('userId', '==', user.uid)
            )
            break
          case 'manager':
            const usersQuery = query(
              collection(db, 'users'),
              where('employmentInfo.managerId', '==', user.uid)
            )
            const userSnapshots = await getDocs(usersQuery)
            const teamUserIds = [user.uid, ...userSnapshots.docs.map(doc => doc.id)]
            timeOffQuery = query(
              collection(db, 'timeOffRequests'),
              where('userId', 'in', teamUserIds)
            )
            break
          case 'admin':
            timeOffQuery = collection(db, 'timeOffRequests')
            break
          default:
            return
        }

        const querySnapshot = await getDocs(timeOffQuery)
        const timeOffEvents = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const request = doc.data()
            
            // Fetch user's name if not present
            let userName = request.userName
            if (!userName) {
              const userData = await getUserInfo(request.userId)
              userName = userData?.displayName || userData?.firstName || 'Unknown User'
            }

            // Ensure proper date conversion and end date handling
            const startDate = request.startDate instanceof Timestamp 
              ? request.startDate.toDate() 
              : new Date(request.startDate)
            
            // Add one day to end date to make it inclusive
            const endDate = request.endDate instanceof Timestamp 
              ? addDays(request.endDate.toDate(), 1)
              : addDays(new Date(request.endDate), 1)

            return {
              id: doc.id,
              title: `${userName} - ${request.type} (${request.status})`,
              start: startDate,
              end: endDate,
              request: { 
                ...request, 
                id: doc.id,
                userName // Add userName to request object
              },
            }
          })
        )

        console.log('Fetched events:', timeOffEvents)
        setEvents(timeOffEvents)
      } catch (error) {
        console.error('Error fetching time off requests:', error)
      }
    }

    fetchRequests()
  }, [user])

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event.request)
  }

  const getEventStyle = (event: CalendarEvent) => {
    const status = event.request.status.toLowerCase()
    switch (status) {
      case 'approved':
        return { backgroundColor: 'hsl(142.1 76.2% 36.3%)' }
      case 'pending':
        return { backgroundColor: 'hsl(47.9 95.8% 53.1%)' }
      case 'rejected':
        return { backgroundColor: 'hsl(0 84.2% 60.2%)' }
      default:
        return { backgroundColor: 'hsl(215 20.2% 65.1%)' }
    }
  }

  const handleNavigate = (newDate: Date) => {
    setDate(newDate)
    // Optionally refetch events if needed
  }

  return (
    <div className="h-[80vh] p-4">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventSelect}
        view={view}
        onView={setView}
        date={date}
        onNavigate={handleNavigate}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        eventPropGetter={(event) => ({
          style: getEventStyle(event as CalendarEvent)
        })}
        popup
        selectable
      />
      <RequestDetailsDialog
        request={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null)
        }}
      />
    </div>
  )
} 