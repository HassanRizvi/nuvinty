"use client"
import { useEffect, useState } from "react"
import DataTable from "@/components/admin/DataTable"
import { BaseUrl } from "@/config"
import { GetData } from "@/helper/general"

type User = {
  _id: string
  name: string
  email: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await GetData({ url: `${BaseUrl}/users`, method: "GET" })
      if (res?.status === 200) setUsers(res.data)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Users</h1>
      <DataTable
        data={users}
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          {
            key: "createdAt",
            header: "Joined At",
            render: (u: any) =>
              new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
                new Date(u.createdAt)
              ),
          },
        ]}
        searchPlaceholder="Search users"
        onCreate={() => {}}
        createLabel="New User"
      />
    </div>
  )
}


