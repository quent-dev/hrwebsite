'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserManagement from "./components/user-management"
import RoleAssignment from "./components/role-assignment"
import Reports from "./components/reports"
import { Card } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="users"
            className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm relative"
          >
            User Management
          </TabsTrigger>
          <TabsTrigger 
            value="roles"
            className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm relative"
          >
            Role Assignment
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm relative"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="p-6">
            <UserManagement />
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="p-6">
            <RoleAssignment />
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="p-6">
            <Reports />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 