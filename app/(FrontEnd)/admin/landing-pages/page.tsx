"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import DataTable from "@/components/admin/DataTable"
import { BaseUrl, Endpoints } from "@/config"
import { GetData, handleGetUser } from "@/helper/general"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, ChevronDown, TrendingUp } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type LandingPageRow = {
  _id: string
  title: string
  slug: string
  status: "active" | "draft" | "fetching"
  createdAt: string
  queryStats?: {
    completed: number
    total: number
  }
}

export default function AdminLandingPagesPage() {
  const [items, setItems] = useState<LandingPageRow[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activateDialogOpen, setActivateDialogOpen] = useState(false)
  const [activatingLandingPage, setActivatingLandingPage] = useState<LandingPageRow | null>(null)
  const [activationProducts, setActivationProducts] = useState<any[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [boostedProductIds, setBoostedProductIds] = useState<Set<string>>(new Set())
  const [deletedProductIds, setDeletedProductIds] = useState<Set<string>>(new Set())
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

  const fetchProductsForActivation = useCallback(async (landingPage: LandingPageRow) => {
    setIsLoadingProducts(true)
    try {
      // Step 1: Fetch queries for this landing page
      const queriesRes = await GetData({ 
        url: `${BaseUrl}/queries/all?landingPageId=${landingPage._id}`, 
        method: "GET" 
      })
      
      console.log("Queries response:", queriesRes)
      
      if (queriesRes?.status === 200 && queriesRes.data && Array.isArray(queriesRes.data) && queriesRes.data.length > 0) {
        // Step 2: Get all query IDs - ensure we convert to ObjectId string format
        const queryIds = queriesRes.data
          .map((q: any) => {
            const id = q._id?.toString() || q.id?.toString()
            return id
          })
          .filter((id: string) => id && id.trim() !== "")
        
        console.log("Query IDs for landing page:", queryIds)
        console.log("Total queries found:", queryIds.length)
        
        if (queryIds.length === 0) {
          setActivationProducts([])
          setIsLoadingProducts(false)
          return
        }

        // Step 3: Fetch products where queryId matches any of these query IDs
        const queryIdsParam = queryIds.join(",")
        const productsUrl = `${BaseUrl}/product?queryIds=${encodeURIComponent(queryIdsParam)}&page=1&limit=1000`
        
        console.log("Fetching products from:", productsUrl)
        
        const productsRes = await GetData({ url: productsUrl, method: "GET" })
        
        console.log("Products response:", productsRes?.products?.length, "products")
        
        if (productsRes?.products && Array.isArray(productsRes.products)) {
          // Double-check: filter products to ensure they have matching queryId
          const filteredProducts = productsRes.products.filter((product: any) => {
            const productQueryId = product.queryId?.toString() || product.queryId
            return productQueryId && queryIds.includes(productQueryId)
          })
          
          console.log("Filtered products count:", filteredProducts.length)
          setActivationProducts(filteredProducts)
        } else {
          setActivationProducts([])
        }
      } else {
        console.log("No queries found for landing page")
        setActivationProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
      setActivationProducts([])
    } finally {
      setIsLoadingProducts(false)
    }
  }, [])

  const handleBoostProduct = useCallback((productId: string) => {
    setBoostedProductIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }, [])

  const handleDeleteProduct = useCallback((productId: string) => {
    setDeletedProductIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }, [])

  const handleStatusChange = useCallback(async (landingPageId: string, newStatus: string, currentStatus: string, queryStats?: { completed: number; total: number }) => {
    // Validate: Can only set to "active" if current status is "draft"
    if (newStatus === "active") {
      if (currentStatus !== "draft") {
        toast.error(`Cannot set status to active. Landing page must be in "draft" status first. Current status is "${currentStatus}".`)
        return
      }
      
      // Double-check that all queries are completed
      const completed = queryStats?.completed || 0
      const total = queryStats?.total || 0
      
      if (total > 0 && completed !== total) {
        toast.error(`Cannot set status to active. Only ${completed} of ${total} queries are completed. All queries must be completed before activating.`)
        return
      }

      // Find the landing page and show activation dialog
      const landingPage = items.find(item => item._id === landingPageId)
      if (landingPage) {
        setActivatingLandingPage(landingPage)
        setActivateDialogOpen(true)
        setBoostedProductIds(new Set())
        setDeletedProductIds(new Set())
        await fetchProductsForActivation(landingPage)
      }
      return
    }
    
    // Prevent manually changing to "fetching" or "draft" - these are auto-managed
    if (newStatus === "fetching" || newStatus === "draft") {
      toast.info("Status will be automatically managed based on query completion. Use 'active' to publish the landing page.")
      return
    }

    const currentUser = handleGetUser()
    const userId = currentUser?._id || null
    
    const updateUrl = userId 
      ? `${BaseUrl}/landing-page?id=${landingPageId}&userId=${userId}`
      : `${BaseUrl}/landing-page?id=${landingPageId}`

    try {
      const response = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (response.ok && data.status === 200) {
        toast.success("Status updated successfully")
        await loadItems()
      } else {
        toast.error(data.message || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("An error occurred while updating status")
    }
  }, [loadItems, items, fetchProductsForActivation])

  const handleConfirmActivation = useCallback(async () => {
    if (!activatingLandingPage) return

    setIsActivating(true)
    const currentUser = handleGetUser()
    const userId = currentUser?._id || null
    
    const updateUrl = userId 
      ? `${BaseUrl}/landing-page?id=${activatingLandingPage._id}&userId=${userId}`
      : `${BaseUrl}/landing-page?id=${activatingLandingPage._id}`

    // Convert Sets to arrays for boosted and deleted products
    const boostedProductsArray = Array.from(boostedProductIds)
    const deletedProjectsArray = Array.from(deletedProductIds)

    try {
      const response = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          status: "active",
          boostedProducts: boostedProductsArray,
          deletedProjects: deletedProjectsArray
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === 200) {
        toast.success("Landing page activated successfully")
        setActivateDialogOpen(false)
        setActivatingLandingPage(null)
        setActivationProducts([])
        setBoostedProductIds(new Set())
        setDeletedProductIds(new Set())
        await loadItems()
      } else {
        toast.error(data.message || "Failed to activate landing page")
      }
    } catch (error) {
      console.error("Error activating landing page:", error)
      toast.error("An error occurred while activating")
    } finally {
      setIsActivating(false)
    }
  }, [activatingLandingPage, loadItems, boostedProductIds, deletedProductIds])

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
              const statusDisplay = (status: string) => status ? status.charAt(0).toUpperCase() + status.slice(1) : status
              const completed = lp.queryStats?.completed || 0
              const total = lp.queryStats?.total || 0
              
              // Show read-only badge for "fetching" and "active" statuses
              // Only show dropdown for "draft" status to allow changing to "active"
              if (lp.status === "fetching" || lp.status === "active") {
                return (
                  <Badge 
                    variant={
                      lp.status === "active" ? "default" : 
                      lp.status === "fetching" ? "secondary" : 
                      "outline"
                    }
                    className="px-2 py-1"
                  >
                    {statusDisplay(lp.status)}
                    {lp.status === "fetching" && total > 0 && (
                      <span className="ml-1 text-xs">({completed}/{total})</span>
                    )}
                  </Badge>
                )
              }
              
              // For "draft" status, show dropdown with "active" option
              // Remove border from SelectTrigger so only badge border shows
              const availableOptions = ["active"]
              
              return (
                <Select
                  value={lp.status || "draft"}
                  onValueChange={(newStatus) => handleStatusChange(lp._id, newStatus, lp.status, lp.queryStats)}
                >
                  <SelectTrigger className="w-auto h-auto p-0 bg-transparent border-0 shadow-none hover:bg-transparent focus:ring-0 focus:ring-offset-0 [&>span]:flex [&>span]:items-center [&>span]:gap-1 [&>svg]:hidden">
                    <SelectValue>
                      <Badge 
                        variant="outline"
                        className="px-2 py-1 cursor-pointer hover:bg-gray-50 flex items-center gap-1.5 transition-none"
                      >
                        <span>{statusDisplay(lp.status)}</span>
                        <ChevronDown className="h-3 w-3 opacity-60" />
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent 
                    className="bg-white border-0 shadow-lg p-1 data-[state=open]:animate-none data-[state=closed]:animate-none !translate-x-0 !translate-y-0"
                    sideOffset={4}
                  >
                    {availableOptions.map((status) => {
                      return (
                        <SelectItem
                          key={status}
                          value={status}
                          className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer border-0 focus:bg-gray-100 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="default"
                              className="px-2 py-0.5 text-xs border-0"
                            >
                              {statusDisplay(status)}
                            </Badge>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )
            },
          },
          {
            key: "queryStats",
            header: "Scraped/Queries",
            render: (lp: any) => {
              const completed = lp.queryStats?.completed || 0
              const total = lp.queryStats?.total || 0
              const isComplete = total > 0 && completed === total
              
              return (
                <span className={`font-medium ${isComplete ? 'text-green-600' : 'text-gray-700'}`}>
                  {completed}/{total}
                </span>
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

      <Dialog 
        open={activateDialogOpen} 
        onOpenChange={(open) => {
          setActivateDialogOpen(open)
          if (!open) {
            setActivatingLandingPage(null)
            setActivationProducts([])
            setBoostedProductIds(new Set())
            setDeletedProductIds(new Set())
          }
        }}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Activate Landing Page</DialogTitle>
            <DialogDescription>
              Review all products from queries before activating "{activatingLandingPage?.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isLoadingProducts ? (
              <div className="text-center py-8 text-gray-500">Loading products...</div>
            ) : activationProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No products found</div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Total Products: <span className="font-semibold">{activationProducts.length}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {activationProducts.map((product: any) => {
                    const productId = product._id?.toString() || product.id?.toString()
                    const isBoosted = productId && boostedProductIds.has(productId)
                    const isDeleted = productId && deletedProductIds.has(productId)
                    
                    return (
                      <div
                        key={productId}
                        className={`border rounded-lg p-3 bg-white hover:shadow-md transition-shadow relative ${
                          isDeleted ? 'opacity-50 bg-red-50' : ''
                        } ${isBoosted ? 'border-green-500 bg-green-50' : ''}`}
                      >
                        <div className="aspect-square bg-gray-100 rounded mb-2 overflow-hidden relative">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                          {/* Boost and Delete Icons */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (productId) handleBoostProduct(productId)
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                isBoosted
                                  ? 'bg-green-500 text-white shadow-md'
                                  : 'bg-white bg-opacity-90 text-gray-600 hover:bg-green-500 hover:text-white'
                              }`}
                              title={isBoosted ? "Remove Boost" : "Boost Product"}
                            >
                              <TrendingUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (productId) handleDeleteProduct(productId)
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                isDeleted
                                  ? 'bg-red-500 text-white shadow-md'
                                  : 'bg-white bg-opacity-90 text-gray-600 hover:bg-red-500 hover:text-white'
                              }`}
                              title={isDeleted ? "Restore Product" : "Delete Product"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-medium truncate text-gray-900">{product.brand || "Brand"}</p>
                        <p className="text-xs text-gray-600 truncate mb-1">{product.name || "Product Name"}</p>
                        <p className="text-sm font-semibold text-[#a67c52]">
                          ${product.price || "0"}
                          {product.currency ? ` ${product.currency}` : ""}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActivateDialogOpen(false)
                setActivatingLandingPage(null)
                setActivationProducts([])
                setBoostedProductIds(new Set())
                setDeletedProductIds(new Set())
              }}
              disabled={isActivating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmActivation}
              disabled={isActivating || isLoadingProducts || activationProducts.length === 0}
              className="bg-[#2c1810] text-white hover:bg-[#1a0f08]"
            >
              {isActivating ? "Activating..." : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


