'use client'

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore"
import { db } from "../../../lib/firebase/config"
import { Search, UserPlus } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
  role: string
  department?: string
  status: 'active' | 'inactive' | 'pending'
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"))
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[]
      setUsers(usersData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      setLoading(false)
    }
  }

  const addNewUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingUser(true)

    try {
      // Check if user already exists
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", newUserEmail.toLowerCase())
      )
      const existingUser = await getDocs(userQuery)

      if (!existingUser.empty) {
        toast.error("User with this email already exists")
        return
      }

      // Add new user with pending status
      const newUser = {
        email: newUserEmail.toLowerCase(),
        name: newUserEmail.split('@')[0], // Default name from email
        role: 'employee', // Default role
        status: 'pending', // Changed to pending
        createdAt: new Date(),
        isPreregistered: true, // Flag to identify pre-registered users
      }

      const docRef = await addDoc(collection(db, "users"), newUser)
      
      setUsers([...users, { ...newUser, id: docRef.id } as User])
      setNewUserEmail("")
      setDialogOpen(false)
      toast.success("User pre-registered successfully. They can now sign in with their Google account.")
    } catch (error) {
      console.error("Error adding user:", error)
      toast.error("Failed to add user")
    } finally {
      setIsAddingUser(false)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await updateDoc(doc(db, "users", userId), {
        status: newStatus
      })
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ))
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await deleteDoc(doc(db, "users", userId))
      setUsers(users.filter(user => user.id !== userId))
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.department?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={addNewUser} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isAddingUser || !newUserEmail}
              >
                {isAddingUser ? "Adding..." : "Add User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.department || '-'}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant={
                    user.status === 'active' 
                      ? 'default' 
                      : user.status === 'pending' 
                        ? 'outline' 
                        : 'secondary'
                  }
                  size="sm"
                  onClick={() => user.status !== 'pending' && toggleUserStatus(user.id, user.status)}
                  disabled={user.status === 'pending'}
                >
                  {user.status}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 