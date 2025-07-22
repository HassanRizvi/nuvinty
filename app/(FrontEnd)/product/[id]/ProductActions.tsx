"use client"
import React, { useState, useEffect } from "react"
import { Heart, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { featchData, handleGetUser } from "@/helper/general"
import { Endpoints } from "@/config"

interface ProductActionsProps {
  productId?: string
  images?: string[]
  name?: string
  url?: string
  actionType?: "back"
  productType?: string
}

export default function ProductActions({ productId, images, name, url, actionType, productType }: ProductActionsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    if (!productId) return
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
          if (user.likedProducts && Array.isArray(user.likedProducts)) {
            setSavedProducts(new Set(user.likedProducts))
          }
        }
      } else {
        setSavedProducts(new Set())
      }
    }
    fetchFav()
  }, [productId])

  const toggleSaveProduct = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!productId) return
    const user = handleGetUser()
    if (!user || !user._id) return
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
      if (response.status !== 200) {
        setSavedProducts((prev) => {
          const newSet = new Set(prev)
          if (newSet.has(productId)) {
            newSet.delete(productId)
          } else {
            newSet.add(productId)
          }
          return newSet
        })
      }
    } catch (error) {
      setSavedProducts((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(productId)) {
          newSet.delete(productId)
        } else {
          newSet.add(productId)
        }
        return newSet
      })
    }
  }

  const nextImage = () => {
    if (images && images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % images.length)
    }
  }
  const prevImage = () => {
    if (images && images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  if (actionType === "back") {
    return (
      <button
        onClick={() => {
          if (window.history.length > 2) {
            router.back()
          } else {
            router.push('/shop')
          }
        }}
        className="flex items-center gap-2 text-[#6b5b4f] hover:text-[#a67c52] transition-colors font-body"
      >
        <X className="w-8 h-8" />
      </button>
    )
  }

  // For image gallery main image, heart button, and thumbnails
  if (images && name && productId && !url) {
    return (
      <div className="relative aspect-square bg-[#f4f0eb] rounded-xl overflow-hidden">
        {/* Heart Save Button - Only show if user is logged in */}
        {handleGetUser() && (
          <button
            onClick={toggleSaveProduct}
            className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${savedProducts.has(productId)
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100 hover:text-red-500"
              }`}
          >
            <Heart className={`w-5 h-5 ${savedProducts.has(productId) ? "fill-current" : ""}`} />
          </button>
        )}
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-contain cursor-pointer"
        />
        {/* Navigation Arrows */}
        {images.length > 1 && (
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
        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="absolute w-full left-0 -bottom-20">
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-[#f4f0eb] rounded-lg border-2 cursor-pointer hover:border-[#a67c52] transition-colors ${index === selectedImage ? "border-[#a67c52]" : "border-[#d4c4b0]"}`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // For action buttons (save/view original and view product)
  if (productId && url) {
    const isLoggedIn = !!handleGetUser()
    return (
      <>
        {/* View Product Button */}
        <button
          onClick={() => window.open(url, '_blank')}
          className="w-full bg-[#2c1810] text-white py-4 px-6 rounded-lg font-luxury font-medium hover:bg-[#1a0f08] transition-colors flex items-center justify-center gap-2 mb-2"
        >
          <span className="text-lg">🛒</span>
          {productType || "View Product"}
        </button>
        {/* Save/View Original Buttons */}
        {isLoggedIn ? (
          <div className="flex gap-3">
            <button
              onClick={toggleSaveProduct}
              className={`flex-1 border-2 rounded-lg py-3 px-4 flex items-center justify-center transition-colors ${savedProducts.has(productId)
                ? "border-red-500 text-red-500 bg-red-50"
                : "border-[#d4c4b0] text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52]"
                }`}
            >
              <Heart className={`w-5 h-5 ${savedProducts.has(productId) ? "fill-current" : ""}`} />
              <span className="ml-2 font-body">
                {savedProducts.has(productId) ? "Saved" : "Save"}
              </span>
            </button>
            <button
              onClick={() => window.open(url, '_blank')}
              className="flex-1 border-2 border-[#d4c4b0] rounded-lg py-3 px-4 flex items-center justify-center text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52] transition-colors font-body"
            >
              ↗ View Original
            </button>
          </div>
        ) : (
          <button
            onClick={() => window.open(url, '_blank')}
            className="w-full border-2 border-[#d4c4b0] rounded-lg py-3 px-4 flex items-center justify-center text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52] transition-colors font-body"
          >
            ↗ View Original
          </button>
        )}
      </>
    )
  }

  return null
} 