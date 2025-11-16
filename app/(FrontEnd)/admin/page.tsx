"use client"
import { useEffect, useState } from "react"
import DataTable from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Endpoints } from "@/config"
import { GetData } from "@/helper/general"
import Link from "next/link"

type UserRow = {
  fullName: string
  email: string
  joinedAt: string
}


const getDashboardData = async () => {
  const response = await GetData(Endpoints.admin.getDashboardData)
  console.log(response)
  return response.data
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    users: 0,
    products: 0,
    queries: 0,
    landingPages: 0,
  })
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => {
    getDashboardData().then((data) => {
      console.log("dashboardData ", data)
      setCounts(data.counts)
      setRecentUsers(data.recentUsers)
    })
  }, [])

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-2xl font-semibold">{counts.users}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-muted-foreground">Total Products</div>
          <div className="text-2xl font-semibold">{counts.products}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-muted-foreground">Total Queries</div>
          <div className="text-2xl font-semibold">{counts.queries}</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-muted-foreground">Total Landing Pages</div>
          <div className="text-2xl font-semibold">{counts.landingPages}</div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Users</h2>
          <Link href="/admin/users" className="text-sm text-[#a67c52] hover:underline">View all</Link>
        </div>
        <DataTable
          data={recentUsers}
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            {
              key: "createdAt",
              header: "Joined At",
              render: (u: any) =>
                new Intl.DateTimeFormat("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                  .format(new Date(u.createdAt)),
            },
          ]}
          searchPlaceholder="Search users"
          onCreate={() => {}}
          createLabel="New User"
        />
      </section>
    </div>
  )
}


