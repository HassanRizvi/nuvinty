"use client"
import { useEffect, useState } from "react"
import DataTable from "@/components/admin/DataTable"
import { BaseUrl } from "@/config"
import { GetData } from "@/helper/general"

type QueryRow = {
  _id: string
  query: string
  status: string
  createdAt: string
}

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<QueryRow[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await GetData({ url: `${BaseUrl}/queries`, method: "GET" })
      if (res?.status === 200) setQueries(res.data)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Queries</h1>
      <DataTable
        data={queries}
        columns={[
          { key: "query", header: "Query" },
          { key: "status", header: "Status" },
          {
            key: "createdAt",
            header: "Created",
            render: (q: any) =>
              new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
                new Date(q.createdAt)
              ),
          },
        ]}
        searchPlaceholder="Search queries"
        onCreate={() => {}}
        createLabel="New Query"
      />
    </div>
  )
}


