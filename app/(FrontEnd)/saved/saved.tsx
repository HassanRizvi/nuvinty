"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Grid, List, X, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import Layout from "@/components/layout"
import { ProductInterface } from "@/types/productInterface"
import { featchData, GetData, handleGetUser } from "@/helper/general"
import { Endpoints } from "@/config"
import Link from "next/link"

interface PaginationInfo {
    currentPage: number
    totalPages: number
    totalProducts: number
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
}

export default function Saved({ 
    products, 
    pagination 
}: { 
    products: ProductInterface[]
    pagination: PaginationInfo
}) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedProduct, setSelectedProduct] = useState<ProductInterface | null>(null)
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState("M")
    const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set())
    const [currentProducts, setCurrentProducts] = useState<ProductInterface[]>(products)
    const [currentPagination, setCurrentPagination] = useState<PaginationInfo>(pagination)
    const [isLoading, setIsLoading] = useState(false)

    // Initialize savedProducts with user's liked products
    useEffect(() => {
        const fetchFav = async () => {
            const user = handleGetUser()
            if (user && user._id) {
                try {
                    const response = await GetData(Endpoints.user.getFav(user._id))
                    console.log("response", response)
                    if (response.status === 200) {
                        setSavedProducts(new Set(response.data))
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

    // Update products when props change
    useEffect(() => {
        setCurrentProducts(products)
        setCurrentPagination(pagination)
    }, [products, pagination])

    const fetchPage = async (page: number) => {
        const user = handleGetUser()
        if (!user || !user._id) return

        setIsLoading(true)
        try {
            const response = await GetData(Endpoints.user.getAllFav(user._id, page, currentPagination.limit))
            if (response.status === 200) {
                setCurrentProducts(response.data)
                setCurrentPagination(response.pagination)
            }
        } catch (error) {
            console.error("Error fetching page:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= currentPagination.totalPages) {
            fetchPage(page)
        }
    }

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
                // Refresh current page to reflect changes
                fetchPage(currentPagination.currentPage)
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

    const openProductDetail = (product: ProductInterface) => {
        setSelectedProduct(product)
        const scrollY = window.scrollY
        document.body.style.overflow = "hidden"
        document.body.style.position = "fixed"
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = "100%"
        document.body.dataset.scrollY = scrollY.toString()
    }

    const closeProductDetail = () => {
        setSelectedProduct(null)
        const scrollY = document.body.dataset.scrollY
        document.body.style.overflow = ""
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        if (scrollY) {
            window.scrollTo(0, Number.parseInt(scrollY))
        }
    }

    const openFullScreenImage = (imageUrl: string, product: ProductInterface, e: React.MouseEvent) => {
        e.stopPropagation()
        setFullScreenImage(imageUrl)
        setSelectedProduct(product)
        const scrollY = window.scrollY
        document.body.style.overflow = "hidden"
        document.body.style.position = "fixed"
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = "100%"
        document.body.dataset.scrollY = scrollY.toString()
    }

    const closeFullScreenImage = () => {
        setFullScreenImage(null)
        setSelectedProduct(null)
        const scrollY = document.body.dataset.scrollY
        document.body.style.overflow = ""
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        if (scrollY) {
            window.scrollTo(0, Number.parseInt(scrollY))
        }
    }

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (fullScreenImage) {
                    closeFullScreenImage()
                } else if (selectedProduct) {
                    closeProductDetail()
                }
            }
        }

        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [fullScreenImage, selectedProduct])

    return (
        <Layout>

            {/* Results Header */}
            <div className="bg-[#fefdfb] px-4 md:px-10 py-4 border-b border-[#d4c4b0]">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="text-sm text-[#6b5b4f] font-body">
                        <h1 className="text-2xl font-semibold text-[#2c1810] font-luxury">
                            {currentPagination.totalProducts} saved items
                        </h1>
                        {currentPagination.totalPages > 1 && (
                            <div className="text-sm text-[#6b5b4f] font-body">
                                Showing <span className="text-[#a67c52] font-medium">
                                    {((currentPagination.currentPage - 1) * currentPagination.limit) + 1}
                                </span> to <span className="text-[#a67c52] font-medium">
                                    {Math.min(currentPagination.currentPage * currentPagination.limit, currentPagination.totalProducts)}
                                </span> of <span className="text-[#a67c52] font-medium">{currentPagination.totalProducts}</span> results
                            </div>
                        )}
                    </div>

                    <div className="flex gap-0 border border-[#d4c4b0] rounded-md overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-3 transition-colors ${viewMode === "grid" ? "bg-[#a67c52] text-white" : "bg-[#fefdfb] text-[#6b5b4f] hover:bg-[#f4f0eb]"
                                }`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-3 transition-colors ${viewMode === "list" ? "bg-[#a67c52] text-white" : "bg-[#fefdfb] text-[#6b5b4f] hover:bg-[#f4f0eb]"
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="bg-[#fefdfb] px-4 md:px-10 py-10">
                <div className="max-w-6xl mx-auto">

                    <div
                        className={`grid gap-8 transition-all duration-300 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                            }`}
                    >
                        {currentProducts.map((product: ProductInterface) => (
                            <div
                                key={product._id}
                                className={`bg-white rounded-xl overflow-hidden shadow-sm border border-[#d4c4b0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer card-luxury ${viewMode === "list" ? "flex flex-row h-40" : ""
                                    }`}
                            >
                                <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-80"}`}>
                                    {/* Heart Save Button - Only show if user is logged in */}
                                    {handleGetUser() && (
                                        <button
                                            onClick={(e) => toggleSaveProduct(product._id, e)}
                                            className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${savedProducts.has(product._id)
                                                ? "bg-red-500 text-white shadow-lg"
                                                : "bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100 hover:text-red-500"
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${savedProducts.has(product._id) ? "fill-current" : ""}`} />
                                        </button>
                                    )}

                                    <Link href={`/product/${product._id}`} className="w-full h-full bg-[#f4f0eb] flex items-center justify-center cursor-pointer hover:bg-[#f0ebe6] transition-colors">
                                        <img
                                            src={product.images[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            className="w-full h-full object-contain bg-white"
                                        />
                                    </Link>
                                </div>

                                <Link href={`/product/${product._id}`} className={`p-5 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
                                    <div className="text-xs text-[#8a7960] uppercase tracking-wide mb-2 font-luxury">{product.brand}</div>
                                    <h3
                                        className={`text-[#2c1810] font-medium mb-2 line-clamp-2 font-body ${viewMode === "list" ? "text-lg" : "text-base"
                                            }`}
                                    >
                                        {product.name}
                                    </h3>
                                    <div
                                        className={`text-[#a67c52] font-semibold font-luxury ${viewMode === "list" ? "text-xl" : "text-lg"}`}
                                    >
                                        {"100"}
                                    </div>
                                    <div className="text-xs text-[#6b5b4f] mt-2 font-body">Direct Shipping • United Kingdom</div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {currentPagination.totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPagination.currentPage - 1)}
                                    disabled={!currentPagination.hasPrevPage || isLoading}
                                    className={`p-2 rounded-md border transition-colors ${
                                        currentPagination.hasPrevPage && !isLoading
                                            ? "border-[#d4c4b0] text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52]"
                                            : "border-[#e5e5e5] text-[#c0c0c0] cursor-not-allowed"
                                    }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: currentPagination.totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            // Show first page, last page, current page, and pages around current
                                            const current = currentPagination.currentPage
                                            const total = currentPagination.totalPages
                                            return page === 1 || 
                                                   page === total || 
                                                   (page >= current - 1 && page <= current + 1)
                                        })
                                        .map((page, index, array) => {
                                            // Add ellipsis if there's a gap
                                            const prevPage = array[index - 1]
                                            const showEllipsis = prevPage && page - prevPage > 1
                                            
                                            return (
                                                <React.Fragment key={page}>
                                                    {showEllipsis && (
                                                        <span className="px-2 text-[#6b5b4f]">...</span>
                                                    )}
                                                    <button
                                                        onClick={() => handlePageChange(page)}
                                                        disabled={isLoading}
                                                        className={`px-3 py-2 rounded-md border transition-colors ${
                                                            page === currentPagination.currentPage
                                                                ? "border-[#a67c52] bg-[#a67c52] text-white"
                                                                : "border-[#d4c4b0] text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52]"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                </React.Fragment>
                                            )
                                        })}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPagination.currentPage + 1)}
                                    disabled={!currentPagination.hasNextPage || isLoading}
                                    className={`p-2 rounded-md border transition-colors ${
                                        currentPagination.hasNextPage && !isLoading
                                            ? "border-[#d4c4b0] text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52]"
                                            : "border-[#e5e5e5] text-[#c0c0c0] cursor-not-allowed"
                                    }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="mt-8 flex justify-center">
                            <div className="text-[#6b5b4f] font-body">Loading...</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Full Screen Product Modal */}
            {fullScreenImage && selectedProduct && (
                <div className="fixed inset-0 bg-white z-[60] flex">
                    {/* Close Button */}
                    <button
                        onClick={closeFullScreenImage}
                        className="absolute top-4 left-4 w-10 h-10 bg-black bg-opacity-20 rounded-full flex items-center justify-center z-10 hover:bg-opacity-30 transition-colors text-black"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Main Image */}
                    <div className="flex-1 bg-[#f4f0eb] flex items-center justify-center p-8">
                        <img
                            src={fullScreenImage || "/placeholder.svg"}
                            alt={selectedProduct.name}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Product Details Sidebar */}
                    <div className="w-80 lg:w-96 bg-white p-6 overflow-y-auto border-l border-[#d4c4b0] flex flex-col">
                        {/* Price */}
                        <div className="text-right mb-4">
                            <div className="text-2xl font-luxury font-semibold text-[#2c1810]">{"100"}</div>
                        </div>

                        {/* Product Info */}
                        <div className="mb-6">
                            <h2 className="text-lg font-luxury font-medium text-[#2c1810] mb-1">
                                {selectedProduct.name}
                            </h2>
                        </div>
                        {/* Brand */}
                        <div className="mb-6">
                            <h4 className="text-xs text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">Brand</h4>
                            <p className="text-sm text-[#2c1810] font-body">{selectedProduct.brand}</p>
                        </div>

                        {/* Product Thumbnails */}
                        <div className="mb-6">
                            <div className="grid grid-cols-4 gap-2">
                                {selectedProduct.images.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => { setFullScreenImage(image) }}
                                        className={`aspect-square bg-[#f4f0eb] rounded border-2 cursor-pointer hover:border-[#a67c52] transition-colors ${image === fullScreenImage ? "border-[#a67c52]" : "border-[#d4c4b0]"
                                            }`}
                                    >
                                        <img
                                            src={image || "/placeholder.svg"}
                                            alt={`View ${index}`}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                        </div>

                        {/* Seller Info */}
                        {selectedProduct.type && (
                            <div className="mb-6 p-3 bg-[#f4f0eb] rounded">
                                <div className="text-sm font-luxury font-medium text-[#a67c52]">{selectedProduct.type}</div>
                                <div className="text-xs text-[#6b5b4f] font-body">Verified authentic items</div>
                            </div>
                        )}

                        {/* Location */}
                        <div className="mb-6">
                            <h4 className="text-xs text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">LOCATION</h4>
                            <p className="text-sm text-[#2c1810] font-body">{selectedProduct.location}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto space-y-4">
                            <button
                                onClick={() => window.open(selectedProduct.url, '_blank')}
                                className="w-full bg-[#2c1810] text-white py-3 px-6 rounded font-luxury font-medium hover:bg-[#1a0f08] transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="text-lg">🛒</span>
                                {selectedProduct.type}
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleSaveProduct(selectedProduct._id, e)
                                    }}
                                    className={`flex-1 border-2 rounded py-2 px-4 flex items-center justify-center transition-colors ${savedProducts.has(selectedProduct._id)
                                        ? "border-red-500 text-red-500 bg-red-50"
                                        : "border-[#d4c4b0] text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52]"
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${savedProducts.has(selectedProduct._id) ? "fill-current" : ""}`} />
                                </button>
                                <button onClick={() => window.open(selectedProduct.url, '_blank')} className="flex-1 border-2 border-[#d4c4b0] rounded py-2 px-4 flex items-center justify-center text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52] transition-colors">
                                    ↗
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
                    <div className="bg-[#fefdfb] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
                        <button
                            onClick={closeProductDetail}
                            className="absolute top-4 left-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center z-10 hover:bg-opacity-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex-1 relative min-h-[300px] md:min-h-[600px]">
                            <div
                                className="w-full h-full bg-[#f4f0eb] flex items-center justify-center cursor-pointer"
                                onClick={(e) => openFullScreenImage(selectedProduct.images[0], selectedProduct, e)}
                            >
                                <img
                                    src={selectedProduct.images[0] || "/placeholder.svg"}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="text-3xl font-semibold text-[#a67c52] mb-4 font-luxury">{"100"}</div>
                            <h2 className="text-2xl text-[#2c1810] mb-2 font-luxury">
                                {selectedProduct.brand} {selectedProduct.name}
                            </h2>
                            <p className="text-[#6b5b4f] mb-8 font-body">Authentic luxury handbag</p>

                            {/* {selectedProduct.seller && ( */}
                            <div className="mb-6 p-3 bg-[#f4f0eb] rounded-lg">
                                <div className="text-sm font-medium text-[#a67c52] font-luxury">{"seller"}</div>
                                <div className="text-xs text-[#6b5b4f] font-body">Verified authentic items</div>
                            </div>
                            {/* )} */}

                            <div className="mb-8">
                                <h4 className="text-xs text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">Shipping</h4>
                                <p className="text-[#2c1810] font-body">Direct Shipping from United Kingdom</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-2 text-[#6b5b4f] mb-2">
                                    <Heart className="w-4 h-4" />
                                    <span className="text-sm font-body">{"100"} people liked this</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-[#2c1810] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#1a0f08] transition-colors flex items-center justify-center gap-2 btn-luxury">
                                    <span>🛒</span>
                                    View on Platform
                                </button>
                                <button
                                    onClick={(e) => toggleSaveProduct(selectedProduct._id, e)}
                                    className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-colors ${savedProducts.has(selectedProduct._id)
                                        ? "border-red-500 text-red-500 bg-red-50"
                                        : "border-[#d4c4b0] text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52]"
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${savedProducts.has(selectedProduct._id) ? "fill-current" : ""}`} />
                                </button>
                                <button className="w-12 h-12 border-2 border-[#d4c4b0] rounded-lg flex items-center justify-center text-[#6b5b4f] hover:border-[#a67c52] hover:text-[#a67c52] transition-colors">
                                    ↗
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}
