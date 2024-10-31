'use client'

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { doc, updateDoc, getDocs, collection } from "firebase/firestore"
import { db } from "../../../lib/firebase/config"
import { toast } from "sonner"
import { Check } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface PendingChange {
  [key: string]: string | null;
}

export default function RoleAssignment() {
  const [users, setUsers] = useState<User[]>([])
  const [pendingChanges, setPendingChanges] = useState<PendingChange>({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"))
    const usersData = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[]
    setUsers(usersData)
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [userId]: newRole
    }))
  }

  const updateUserRole = async (userId: string) => {
    const newRole = pendingChanges[userId]
    if (!newRole) return

    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole
      })
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ))
      // Clear the pending change after successful update
      setPendingChanges(prev => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
      toast.success("Role updated successfully")
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Failed to update role")
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>Assign Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Select
                  value={pendingChanges[user.id] || user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {pendingChanges[user.id] && pendingChanges[user.id] !== user.role && (
                  <Button
                    size="sm"
                    onClick={() => updateUserRole(user.id)}
                    className="w-[100px]"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 