"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { featchData } from "@/helper/general"
import { BaseUrl } from "@/config"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

type CreateLandingPageDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

type QueryItem = {
  id: string
  query: string
  range: string
}

export default function CreateLandingPageDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateLandingPageDialogProps) {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Query states
  const [queries, setQueries] = useState<QueryItem[]>([])
  const [queryText, setQueryText] = useState("")
  const [queryRange, setQueryRange] = useState("")

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

  const handleAddQuery = () => {
    if (!queryText.trim()) {
      toast.error("Query text is required")
      return
    }
    if (!queryRange.trim()) {
      toast.error("Range is required")
      return
    }

    const newQuery: QueryItem = {
      id: Date.now().toString(),
      query: queryText.trim(),
      range: queryRange.trim(),
    }

    setQueries((prev) => [newQuery, ...prev])
    setQueryText("")
    setQueryRange("")
  }

  const handleRemoveQuery = (id: string) => {
    setQueries((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    const body = {
      Title: title,
      Slug: slug,
      Filters: {},
      IsDeleted: false,
      BoostedProducts: [],
      DeletedProjects: [],
      Queries: queries.map((q) => ({
        query: q.query,
        range: q.range,
      })),
    }

    try {
      const res = await featchData({ url: `${BaseUrl}/landing-page`, method: "POST" }, body)
      if (res.status === 201) {
        toast.success("Landing page created successfully")
        // Reset form
        setTitle("")
        setSlug("")
        setStep(1)
        setQueries([])
        setQueryText("")
        setQueryRange("")
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
            {step === 1 ? "Enter basic information" : "Add queries for the landing page"}
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

            </>
          )}

          {step === 2 && (
            <>
              {/* Queries List */}
              {queries.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-[#2c1810] font-medium">Added Queries ({queries.length})</Label>
                  <div className="rounded-lg border border-[#d4c4b0] p-4 bg-[#fefdfb] max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {queries.map((queryItem) => (
                        <div
                          key={queryItem.id}
                          className="flex items-center justify-between p-3 bg-white rounded border border-[#d4c4b0] hover:border-[#a67c52] transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm text-[#2c1810]">{queryItem.query}</p>
                            <p className="text-xs text-[#6b5b4f] mt-1">Range: {queryItem.range}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuery(queryItem.id)}
                            className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add Query Form */}
              <div className="space-y-3">
                <Label className="text-[#2c1810] font-medium">Add Query</Label>
                <div className="rounded-lg border border-[#d4c4b0] p-4 bg-[#fefdfb]">
                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="query-text" className="text-[#2c1810] text-sm font-medium">Query</Label>
                      <Input
                        id="query-text"
                        placeholder="e.g., designer handbags"
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddQuery()
                          }
                        }}
                        className="border-[#d4c4b0] bg-white text-[#2c1810] focus:border-[#a67c52] focus:ring-[#a67c52] placeholder:text-[#6b5b4f]"
                      />
                    </div>
                    <div className="w-full sm:w-36 space-y-2">
                      <Label htmlFor="query-range" className="text-[#2c1810] text-sm font-medium">Range</Label>
                      <Input
                        id="query-range"
                        type="number"
                        placeholder="e.g., 100"
                        value={queryRange}
                        onChange={(e) => setQueryRange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddQuery()
                          }
                        }}
                        className="border-[#d4c4b0] bg-white text-[#2c1810] focus:border-[#a67c52] focus:ring-[#a67c52] placeholder:text-[#6b5b4f]"
                      />
                    </div>
                    <Button 
                      onClick={handleAddQuery} 
                      className="w-full sm:w-auto px-6 bg-[#2c1810] text-white hover:bg-[#1a0f08] transition-colors font-medium"
                    >
                      Add Query
                    </Button>
                  </div>
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

