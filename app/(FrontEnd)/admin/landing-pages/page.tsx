"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import DataTable from "@/components/admin/DataTable"
import { BaseUrl } from "@/config"
import { GetData, handleGetUser } from "@/helper/general"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import CreateLandingPageDialog from "@/components/admin/CreateLandingPageDialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type LandingPageRow = {
  _id: string
  title: string
  slug: string
  status: "active" | "draft" | "fetching"
  createdAt: string
}

export default function AdminLandingPagesPage() {
  const [items, setItems] = useState<LandingPageRow[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const landingPageToDeleteRef = useRef<string | null>(null)

  const loadItems = useCallback(async () => {
    const res = await GetData({ url: `${BaseUrl}/landing-page`, method: "GET" })
    if (res?.status === 200) setItems(res.data)
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const handleDeleteClick = (landingPageId: string) => {
    landingPageToDeleteRef.current = landingPageId
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = useCallback(async () => {
    const landingPageId = landingPageToDeleteRef.current
    if (!landingPageId) {
      setDeleteDialogOpen(false)
      return
    }

    setDeleteDialogOpen(false)
    landingPageToDeleteRef.current = null

    // Get user fresh - try from state first, then from cookie
    // Temporary: Allow deletion without auth for now (will enable auth later)
    const currentUser = handleGetUser()
    const userId = currentUser?._id || null
    
    // Build URL - only include userId if we have one
    const deleteUrl = userId 
      ? `${BaseUrl}/landing-page/delete?id=${landingPageId}&userId=${userId}`
      : `${BaseUrl}/landing-page/delete?id=${landingPageId}`

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.status === 200) {
        toast.success("Landing page deleted successfully")
        // Optimistically remove the landing page from the list immediately
        setItems((prevItems) => prevItems.filter((item) => item._id !== landingPageId))
        // Then reload to ensure we have the latest data
        await loadItems()
      } else {
        toast.error(data.message || data.error || "Failed to delete landing page")
        // Reload to get the correct state in case of error
        await loadItems()
      }
    } catch (error) {
      console.error("Error deleting landing page:", error)
      toast.error("An error occurred while deleting the landing page")
      // Reload to get the correct state in case of error
      await loadItems()
    }
  }, [loadItems])

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
            render: (lp: any) => {
              const statusColor = 
                lp.status === "active" ? "default" : 
                lp.status === "fetching" ? "secondary" : 
                "outline"
              const statusDisplay = lp.status ? lp.status.charAt(0).toUpperCase() + lp.status.slice(1) : lp.status
              return (
                <Badge variant={statusColor}>{statusDisplay}</Badge>
              )
            },
          },
          {
            key: "createdAt",
            header: "Created",
            render: (lp: any) =>
              new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
                new Date(lp.createdAt)
              ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (lp: any) => {
              return (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDeleteClick(lp._id)
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete landing page"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )
            },
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

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            landingPageToDeleteRef.current = null
          }
        }}
      >
        <AlertDialogContent className="bg-[#fefdfb] border-[#d4c4b0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#2c1810]">Delete Landing Page</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6b5b4f]">
              Are you sure you want to delete this landing page? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#d4c4b0] text-[#2c1810] hover:bg-[#f8f6f3]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


