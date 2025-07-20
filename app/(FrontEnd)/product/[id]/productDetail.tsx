"use client"
import React, { useState, useEffect } from "react"
import { Heart, X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout"
import { ProductInterface } from "@/types/productInterface"
import { featchData, handleGetUser } from "@/helper/general"
import { Endpoints } from "@/config"

interface ProductDetailProps {
  product: ProductInterface
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Initialize savedProducts with user's liked products
  useEffect(() => {
    const fetchFav = async () => {
      const user = handleGetUser()
      if (user && user._id) {
        try {
          const response = await fetch(Endpoints.user.getFav(user._id).url, {
            method: Endpoints.user.getFav(user._id).method,
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const data = await response.json()
          if (data.status === 200) {
            setSavedProducts(new Set(data.data))
          }
        } catch (error) {
          console.error("Error fetching favorites:", error)
          // Fallback to local storage if API fails
          if (user.likedProducts && Array.isArray(user.likedProducts)) {
            setSavedProducts(new Set(user.likedProducts))
          }
        }
      } else {
        // If no user is logged in, clear saved products
        setSavedProducts(new Set())
      }
    }
    fetchFav()
  }, [])

  const toggleSaveProduct = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const user = handleGetUser()
    if (!user || !user._id) {
      console.error("User not found")
      return
    }

    // Optimistically update UI
    setSavedProducts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })

    try {
      const response = await featchData(Endpoints.user.addToFav, {
        userId: user._id,
        productId: productId
      })

      if (response.status === 200) {
        console.log("Product toggled successfully")
      } else {
        // Revert the optimistic update if the API call failed
        setSavedProducts((prev) => {
          const newSet = new Set(prev)
          if (newSet.has(productId)) {
            newSet.delete(productId)
          } else {
            newSet.add(productId)
          }
          return newSet
        })
        console.error("Failed to toggle product")
      }
    } catch (error) {
      // Revert the optimistic update if the API call failed
      setSavedProducts((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(productId)) {
          newSet.delete(productId)
        } else {
          newSet.add(productId)
        }
        return newSet
      })
      console.error("Error toggling product:", error)
    }
  }

  const openFullScreenImage = (imageUrl: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFullScreenImage(imageUrl)
    const scrollY = window.scrollY
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = "100%"
    document.body.dataset.scrollY = scrollY.toString()
  }

  const closeFullScreenImage = () => {
    setFullScreenImage(null)
    const scrollY = document.body.dataset.scrollY
    document.body.style.overflow = ""
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""
    if (scrollY) {
      window.scrollTo(0, Number.parseInt(scrollY))
    }
  }

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullScreenImage) {
          closeFullScreenImage()
        }
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [fullScreenImage])

  return (
    <Layout>
      {/* Back Button */}
      {/* <div className="bg-[#fefdfb] px-4 md:px-10 py-4 border-b border-[#d4c4b0]">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#6b5b4f] hover:text-[#a67c52] transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>
        </div>
      </div> */}

      {/* Product Detail */}
      <div className="bg-[#fefdfb] px-4 md:px-10 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative aspect-square bg-[#f4f0eb] rounded-xl overflow-hidden">
                {/* Heart Save Button - Only show if user is logged in */}
                {handleGetUser() && (
                  <button
                    onClick={(e) => toggleSaveProduct(product._id, e)}
                    className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
                      savedProducts.has(product._id)
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${savedProducts.has(product._id) ? "fill-current" : ""}`} />
                  </button>
                )}

                {product.images && product.images.length > 0 && (
                  <>
                    <img
                      src={product.images[selectedImage] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={(e) => openFullScreenImage(product.images[selectedImage], e)}
                    />
                    
                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-[#f4f0eb] rounded-lg border-2 cursor-pointer hover:border-[#a67c52] transition-colors ${
                        index === selectedImage ? "border-[#a67c52]" : "border-[#d4c4b0]"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              {/* Brand and Name */}
              <div>
                <div className="text-sm text-[#8a7960] uppercase tracking-wide mb-2 font-luxury">
                  {product.brand}
                </div>
                <h1 className="text-3xl font-semibold text-[#2c1810] mb-4 font-luxury">
                  {product.name}
                </h1>
                <div className="text-2xl font-semibold text-[#a67c52] font-luxury">
                  {product.price ? product.price : "100"} {product.currency ? product.currency : ""}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                {product.category && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Category
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.category}</p>
                  </div>
                )}

                {product.condition && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Condition
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.condition}</p>
                  </div>
                )}

                {product.material && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Material
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.material}</p>
                  </div>
                )}

                {product.color && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Color
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.color}</p>
                  </div>
                )}

                {product.location && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Location
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.location}</p>
                  </div>
                )}

                {product.size && product.size.length > 0 && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Available Sizes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.size.map((size, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#f4f0eb] text-[#2c1810] rounded-md text-sm font-body"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Badge */}
              {product.type && (
                <div className="p-4 bg-[#f4f0eb] rounded-lg">
                  <div className="text-sm font-medium text-[#a67c52] font-luxury">
                    {product.type}
                  </div>
                  <div className="text-xs text-[#6b5b4f] font-body">
                    Verified authentic items
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => window.open(product.url, '_blank')}
                  className="w-full bg-[#2c1810] text-white py-4 px-6 rounded-lg font-luxury font-medium hover:bg-[#1a0f08] transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🛒</span>
                  {product.type || "View Product"}
                </button>

                {handleGetUser() ? (
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => toggleSaveProduct(product._id, e)}
                      className={`flex-1 border-2 rounded-lg py-3 px-4 flex items-center justify-center transition-colors ${
                        savedProducts.has(product._id)
                          ? "border-red-500 text-red-500 bg-red-50"
                          : "border-[#d4c4b0] text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52]"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${savedProducts.has(product._id) ? "fill-current" : ""}`} />
                      <span className="ml-2 font-body">
                        {savedProducts.has(product._id) ? "Saved" : "Save"}
                      </span>
                    </button>
                    <button
                      onClick={() => window.open(product.url, '_blank')}
                      className="flex-1 border-2 border-[#d4c4b0] rounded-lg py-3 px-4 flex items-center justify-center text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52] transition-colors font-body"
                    >
                      ↗ View Original
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => window.open(product.url, '_blank')}
                    className="w-full border-2 border-[#d4c4b0] rounded-lg py-3 px-4 flex items-center justify-center text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52] transition-colors font-body"
                  >
                    ↗ View Original
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4">
          <button
            onClick={closeFullScreenImage}
            className="absolute top-4 left-4 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center z-10 hover:bg-opacity-30 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <img
              src={fullScreenImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </Layout>
  )
} 