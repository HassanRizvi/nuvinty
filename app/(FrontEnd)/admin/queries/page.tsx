"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import DataTable from "@/components/admin/DataTable"
import { BaseUrl } from "@/config"
import { GetData, handleGetUser } from "@/helper/general"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
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

type QueryRow = {
  _id: string
  query: string
  status: string
  createdAt: string
}

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<QueryRow[]>([])
  const [user, setUser] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const queryToDeleteRef = useRef<string | null>(null)

  const load = useCallback(async () => {
    const res = await GetData({ url: `${BaseUrl}/queries`, method: "GET" })
    if (res?.status === 200) setQueries(res.data)
  }, [])

  useEffect(() => {
    load()
    // Get user once on component mount
    const currentUser = handleGetUser()
    setUser(currentUser)
  }, [load])

  const handleDeleteClick = (queryId: string) => {
    queryToDeleteRef.current = queryId
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = useCallback(async () => {
    const queryId = queryToDeleteRef.current
    if (!queryId) {
      setDeleteDialogOpen(false)
      return
    }

    setDeleteDialogOpen(false)
    queryToDeleteRef.current = null
    console.log("User confirmed deletion for query:", queryId)

    // Get user fresh - try from state first, then from cookie
    // Temporary: Allow deletion without auth for now (will enable auth later)
    const currentUser = handleGetUser()
    console.log("Current user from cookie:", currentUser)
    const userId = currentUser?._id || null
    
    // Build URL - only include userId if we have one
    const deleteUrl = userId 
      ? `${BaseUrl}/queries/delete?id=${queryId}&userId=${userId}`
      : `${BaseUrl}/queries/delete?id=${queryId}`
    
    console.log("Deleting with userId:", userId)
    console.log("Making DELETE request to:", deleteUrl)

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      const data = await response.json()
      console.log("Delete response data:", data)

      if (response.ok && data.status === 200) {
        toast.success("Query deleted successfully")
        // Optimistically remove the query from the list immediately
        setQueries((prevQueries) => prevQueries.filter((q) => q._id !== queryId))
        // Then reload to ensure we have the latest data
        await load()
      } else {
        toast.error(data.message || data.error || "Failed to delete query")
        // Reload to get the correct state in case of error
        await load()
      }
    } catch (error) {
      console.error("Error deleting query:", error)
      toast.error("An error occurred while deleting the query")
      // Reload to get the correct state in case of error
      await load()
    }
  }, [load])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Queries</h1>
      <DataTable
        data={queries}
        columns={[
          {
            key: "query",
            header: "Query",
            render: (q: any) => {
              const queryText = q.query || ""
              const maxLength = 50
              if (queryText.length > maxLength) {
                return (
                  <span title={queryText} className="truncate block max-w-xs">
                    {queryText.substring(0, maxLength)}...
                  </span>
                )
              }
              return <span>{queryText}</span>
            },
          },
          { key: "status", header: "Status" },
          {
            key: "createdAt",
            header: "Created",
            render: (q: any) =>
              new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
                new Date(q.createdAt)
              ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (q: any) => {
              return (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDeleteClick(q._id)
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete query"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )
            },
          },
        ]}
        searchPlaceholder="Search queries"
        onCreate={() => {}}
        createLabel="New Query"
      />

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            queryToDeleteRef.current = null
          }
        }}
      >
        <AlertDialogContent className="bg-[#fefdfb] border-[#d4c4b0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#2c1810]">Delete Query</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6b5b4f]">
              Are you sure you want to delete this query? This action cannot be undone.
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


