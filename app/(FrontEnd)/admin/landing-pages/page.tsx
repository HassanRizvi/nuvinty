"use client"
import { useEffect, useState } from "react"
import DataTable from "@/components/admin/DataTable"
import { BaseUrl } from "@/config"
import { GetData } from "@/helper/general"
import { Badge } from "@/components/ui/badge"
import CreateLandingPageDialog from "@/components/admin/CreateLandingPageDialog"

type LandingPageRow = {
  _id: string
  title: string
  slug: string
  status: "active" | "draft"
  createdAt: string
}

export default function AdminLandingPagesPage() {
  const [items, setItems] = useState<LandingPageRow[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadItems = async () => {
    const res = await GetData({ url: `${BaseUrl}/landing-page`, method: "GET" })
    if (res?.status === 200) setItems(res.data)
  }

  useEffect(() => {
    loadItems()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Landing Pages</h1>
      <DataTable
        data={items}
        columns={[
          { key: "title", header: "Title" },
          { key: "slug", header: "Slug" },
          {
            key: "status",
            header: "Status",
            render: (lp: any) => (
              <Badge variant={lp.status === "active" ? "default" : "secondary"}>{lp.status}</Badge>
            ),
          },
          {
            key: "createdAt",
            header: "Created",
            render: (lp: any) =>
              new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
                new Date(lp.createdAt)
              ),
          },
        ]}
        searchPlaceholder="Search landing pages"
        onCreate={() => setDialogOpen(true)}
        createLabel="New Landing Page"
      />

      <CreateLandingPageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadItems}
      />
    </div>
  )
}


