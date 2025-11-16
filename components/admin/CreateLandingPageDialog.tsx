"use client"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductFilters from "@/components/ProductFilters"
import { featchData, GetData } from "@/helper/general"
import { BaseUrl, Endpoints } from "@/config"
import { toast } from "sonner"
import { ProductInterface } from "@/types/productInterface"
import ProductCard from "@/components/admin/ProductCard"

type CreateLandingPageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function CreateLandingPageDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateLandingPageDialogProps) {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [status, setStatus] = useState<"active" | "draft">("draft")
  const [isLoading, setIsLoading] = useState(false)

  // Filter states
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [condition, setCondition] = useState("")
  const [size, setSize] = useState("")
  const [gender, setGender] = useState("")
  const [price, setPrice] = useState("")

  // Products preview
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Product actions
  const [deletedProducts, setDeletedProducts] = useState<string[]>([])
  const [boostedProducts, setBoostedProducts] = useState<string[]>([])

  const handleClearFilters = () => {
    setCategory("")
    setBrand("")
    setCondition("")
    setSize("")
    setGender("")
    setPrice("")
  }

  // Fetch products when filters change
  useEffect(() => {
    if (step === 2) {
      setCurrentPage(1) // Reset to page 1 when filters change
      fetchProducts(1)
    }
  }, [step, category, brand, condition, size, gender, price])

  // Fetch products when page changes
  useEffect(() => {
    if (step === 2 && currentPage > 1) {
      fetchProducts(currentPage)
    }
  }, [currentPage])

  const fetchProducts = async (page: number) => {
    setIsLoadingProducts(true)
    try {
      const response = await GetData(
        Endpoints.product.getProducts("", page, 12, category, brand, condition, size, "", gender, price)
      )
      if (response?.products) {
        setProducts(response.products)
        setTotalProducts(response.pagination?.totalProducts || 0)
        setTotalPages(response.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const handleNext = () => {
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and Slug are required")
      return
    }
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleDeleteProduct = (productId: string) => {
    setDeletedProducts((prev) => {
      if (prev.includes(productId)) {
        // Remove from deleted
        return prev.filter((id) => id !== productId)
      } else {
        // Add to deleted
        return [...prev, productId]
      }
    })
  }

  const handleBoostProduct = (productId: string) => {
    setBoostedProducts((prev) => {
      if (prev.includes(productId)) {
        // Remove from boosted
        return prev.filter((id) => id !== productId)
      } else {
        // Add to boosted
        return [...prev, productId]
      }
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    const filters: Record<string, string> = {}
    if (category) filters.category = category
    if (brand) filters.brand = brand
    if (condition) filters.condition = condition
    if (size) filters.size = size
    if (gender) filters.gender = gender
    if (price) filters.price = price

    const body = {
      Title: title,
      Slug: slug,
      Status: status,
      Filters: filters,
      IsDeleted: false,
      BoostedProducts: boostedProducts,
      DeletedProjects: deletedProducts,
    }

    try {
      const res = await featchData({ url: `${BaseUrl}/landing-page`, method: "POST" }, body)
      if (res.status === 201) {
        toast.success("Landing page created successfully")
        // Reset form
        setTitle("")
        setSlug("")
        setStatus("draft")
        setStep(1)
        setDeletedProducts([])
        setBoostedProducts([])
        handleClearFilters()
        onOpenChange(false)
        if (onSuccess) onSuccess()
      } else {
        toast.error(res.message || "Failed to create landing page")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white">
        <DialogHeader>
          <DialogTitle>Create Landing Page - Step {step} of 2</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Enter basic information" : "Configure product filters"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <>
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Bags"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="e.g., summer-bags"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "draft")}
                  className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Filters Section */}
              <div className="space-y-3">
                <Label>Product Filters</Label>
                <div className="rounded-lg border p-4 bg-gray-50">
                  <ProductFilters
                    category={category}
                    brand={brand}
                    condition={condition}
                    size={size}
                    gender={gender}
                    price={price}
                    onCategoryChange={setCategory}
                    onBrandChange={setBrand}
                    onConditionChange={setCondition}
                    onSizeChange={setSize}
                    onGenderChange={setGender}
                    onPriceChange={setPrice}
                    onClearAll={handleClearFilters}
                  />
                </div>
              </div>

              {/* Products Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Products Preview</Label>
                  <span className="text-sm text-muted-foreground">
                    {isLoadingProducts ? "Loading..." : `${totalProducts} products found`}
                  </span>
                </div>
                <div className="rounded-lg border p-4 bg-white">
                  {isLoadingProducts ? (
                    <div className="text-center py-8 text-muted-foreground">Loading products...</div>
                  ) : products.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                        {products.map((product) => (
                          <ProductCard 
                            key={product._id} 
                            product={product}
                            isDeleted={deletedProducts.includes(product._id)}
                            isBoosted={boostedProducts.includes(product._id)}
                            onDelete={handleDeleteProduct}
                            onBoost={handleBoostProduct}
                          />
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((p) => p - 1)}
                              disabled={currentPage === 1 || isLoadingProducts}
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((p) => p + 1)}
                              disabled={currentPage === totalPages || isLoadingProducts}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No products match the selected filters
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          {step === 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Landing Page"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

