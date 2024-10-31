'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../../lib/firebase/config"
import { Download } from "lucide-react"

export default function Reports() {
  const [generating, setGenerating] = useState(false)

  const generateReport = async (reportType: string) => {
    setGenerating(true)
    try {
      let data: any[] = []
      
      switch (reportType) {
        case 'timeOff':
          const timeOffSnapshot = await getDocs(collection(db, 'timeOffRequests'))
          data = timeOffSnapshot.docs.map(doc => doc.data())
          break
        case 'users':
          const usersSnapshot = await getDocs(collection(db, 'users'))
          data = usersSnapshot.docs.map(doc => doc.data())
          break
        // Add more report types as needed
      }

      // Convert to CSV
      const csvContent = convertToCSV(data)
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${reportType}_report_${new Date().toISOString()}.csv`
      link.click()
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGenerating(false)
    }
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const rows = data.map(obj => 
      headers.map(header => JSON.stringify(obj[header] || '')).join(',')
    )
    
    return [
      headers.join(','),
      ...rows
    ].join('\n')
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Time Off Report</CardTitle>
          <CardDescription>
            Generate a report of all time off requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => generateReport('timeOff')}
            disabled={generating}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Report</CardTitle>
          <CardDescription>
            Generate a report of all users and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => generateReport('users')}
            disabled={generating}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 