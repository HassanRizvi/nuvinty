"use client"
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { debounce } from "lodash"
import { Grid, List, X, Heart, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import Layout from "@/components/layout"
import { ProductInterface } from "@/types/productInterface"
import { featchData, GetData, handleGetUser } from "@/helper/general"
import { Endpoints } from "@/config"
import Link from "next/link"
import FiltersData from "@/categories.json"
import AuthModal from '@/components/auth-modal'

interface PaginationInfo {
    currentPage: number
    totalPages: number
    totalProducts: number
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
}

interface Filters {
    q?: string;
    category?: string;
    brand?: string;
    condition?: string;
    size?: string;
    location?: string;
    gender?: string;
    price?: string;
}

interface ShopProps {
    products: ProductInterface[];
    pagination: PaginationInfo;
    initialFilters?: Filters;
}

export default function Shop({
    products,
    pagination,
    initialFilters = {},
    openAuthModal
}: ShopProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedProduct, setSelectedProduct] = useState<ProductInterface | null>(null)
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState("M")
    const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set())
    const [currentProducts, setCurrentProducts] = useState<ProductInterface[]>(products)
    const [currentPagination, setCurrentPagination] = useState<PaginationInfo>(pagination)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState(initialFilters.q || "")
    const [category, setCategory] = useState(initialFilters.category || "")
    const [brand, setBrand] = useState(initialFilters.brand || "")
    const [condition, setCondition] = useState(initialFilters.condition || "")
    const [size, setSize] = useState(initialFilters.size || "")
    const [location, setLocation] = useState(initialFilters.location || "")
    const [gender, setGender] = useState(initialFilters.gender || "")
    const [price, setPrice] = useState(initialFilters.price || "")
    const [showFilters, setShowFilters] = useState(true)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()




    // Initialize savedProducts with user's liked products
    useEffect(() => {
        const q = searchParams.get('q')
        const category = searchParams.get('category')
        const brand = searchParams.get('brand')
        const condition = searchParams.get('condition')
        const size = searchParams.get('size')
        const location = searchParams.get('location')
        const gender = searchParams.get('gender')
        const price = searchParams.get('price')

        setSearchQuery(q || "")
        setCategory(category || "")
        setBrand(brand || "")
        setCondition(condition || "")
        setSize(size || "")
        setLocation(location || "")
        setGender(gender || "")
        setPrice(price || "")
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
    // useEffect(() => {
    //     setCurrentProducts(products)
    //     setCurrentPagination(pagination)
    // }, [products, pagination])

    const debouncedFetchPage = useMemo(
        () => debounce(async (page: number, search: string = searchQuery, category: string = "", brand: string = "", condition: string = "", size: string = "", location: string = "", gender: string = "", price: string = "") => {
            setIsLoading(true)
            try {
                const response = await GetData(Endpoints.product.getProducts(search, page, currentPagination.limit, category, brand, condition, size, location, gender, price))
                if (response.products) {
                    console.log("Products available :", response.products.length)
                    if (response.products.length != 0) {
                        setCurrentProducts(response.products)
                        setCurrentPagination(response.pagination)
                    } else {
                        console.log("No products available")
                        setCurrentProducts([])
                        setCurrentPagination({
                            currentPage: 1,
                            totalPages: 1,
                            totalProducts: 0,
                            hasNextPage: false,
                            hasPrevPage: false,
                            limit: 50
                        })
                    }
                } else {
                    setCurrentProducts([])
                    setCurrentPagination({
                        currentPage: 1,
                        totalPages: 1,
                        totalProducts: 0,
                        hasNextPage: false,
                        hasPrevPage: false,
                        limit: 50
                    })
                }
            } catch (error) {
                console.error("Error fetching page:", error)
            } finally {
                setIsLoading(false)
            }
        }, 300),
        [currentPagination.limit]
    )

    const fetchPage = useCallback((...args: Parameters<typeof debouncedFetchPage>) => {
        debouncedFetchPage(...args)
    }, [debouncedFetchPage])
    const handleToggleFilters = () => {
        setShowFilters(!showFilters)
    }
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= currentPagination.totalPages) {
            fetchPage(page)
        }
    }
    const handleSearch = async (query: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('q', query)
        router.push(`/shop?${params.toString()}`)
        setSearchQuery(query)
        await fetchPage(1, query, category, brand, condition, size, location, gender, price)
    }
    const debouncedToggleSave = useMemo(
        () => debounce(async (userId: string, productId: string) => {
            try {
                const response = await featchData(Endpoints.user.addToFav, {
                    userId,
                    productId
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
        }, 300),
        []
    )
    const toggleSaveProduct = async (productId: string, e: React.MouseEvent) => {
        const logedin = handleGetUser()
        if (logedin) {
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
            debouncedToggleSave(user._id, productId)
        }else{
            // alert("Please login to save products")
            setIsAuthModalOpen(true)
            // openAuthModal?.("login")
        }
    }
    const closeAuthModal = () => {
        setIsAuthModalOpen(false)
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
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('category', e.target.value)
        router.push(`/shop?${params.toString()}`)
        setCategory(e.target.value)
        fetchPage(1, searchQuery, e.target.value, brand, condition, size, location, gender, price)
    }
    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('brand', e.target.value)
        router.push(`/shop?${params.toString()}`)
        setBrand(e.target.value)
        fetchPage(1, searchQuery, category, e.target.value, condition, size, location, gender, price)
    }
    const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('condition', e.target.value)
        router.push(`/shop?${params.toString()}`)
        setCondition(e.target.value)
        fetchPage(1, searchQuery, category, brand, e.target.value, size, location, gender, price)
    }
    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('size', e.target.value)
        router.push(`/shop?${params.toString()}`)
        setSize(e.target.value)
        fetchPage(1, searchQuery, category, brand, condition, e.target.value, location, gender, price)
    }
    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('location', e.target.value)
        router.push(`/shop?${params.toString()}`)
        setLocation(e.target.value)
        fetchPage(1, searchQuery, category, brand, condition, size, e.target.value, gender, price)
    }
    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('gender', e.target.value)
        router.push(`/shop?${params.toString()}`)
        setGender(e.target.value)
        fetchPage(1, searchQuery, category, brand, condition, size, location, e.target.value, price)
    }
    const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('price', e.target.value)
        router.push(`/shop?${params.toString()}`)
        setPrice(e.target.value)
        fetchPage(1, searchQuery, category, brand, condition, size, location, gender, e.target.value)
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
    useEffect(() => {
        if (window.innerWidth < 768) {
            setShowFilters(false)
        } else {
            setShowFilters(true)
        }
    }, [window.innerWidth])

    return (
        <Layout handleSearch={handleSearch} searchQuery={searchQuery}>
            {/* Search and Filters */}
            <div className="bg-[#fefdfb] px-4 md:px-10 py-6 border-b border-[#d4c4b0]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex mb-4 items-center gap-2 md:hidden ">
                        <button onClick={handleToggleFilters} className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-medium text-[#6b5b4f] font-luxury">Filters</span>
                        </button>
                    </div>
                    {showFilters && (
                        <div className="flex flex-wrap gap-6 md:flex-nowrap">

                            <div className="flex items-center gap-3 w-[45%] md:w-40">
                                {/* <span className="text-sm font-medium text-[#6b5b4f] font-luxury">Category:</span> */}
                                <select className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body" onChange={(e) => handleCategoryChange(e)} value={category}>
                                    <option value="">All Categories</option>
                                    {FiltersData.map((category: any) => (
                                        <option key={category.category} value={category.category}>{category.category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-3 w-[45%] md:w-40">
                                {/* <span className="text-sm font-medium text-[#6b5b4f] font-luxury">Brand:</span> */}
                                <select className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body" onChange={(e) => handleBrandChange(e)} value={brand}>
                                    <option value="">All Brands</option>
                                    {category ?
                                        FiltersData.find((cat) => cat.category === category)?.brands.map((brand) => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))
                                        :
                                        FiltersData.flatMap((cat) => cat.brands).map((brand) => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="flex items-center gap-3 w-[45%] md:w-40">
                                {/* <span className="text-sm font-medium text-[#6b5b4f] font-luxury">Condition:</span> */}
                                <select className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body" onChange={(e) => handleConditionChange(e)} value={condition}>
                                    <option value="">Any Condition</option>
                                    <option value="New without tag">New without tag</option>
                                    <option value="New without box">New without box</option>
                                    <option value="New other">New other</option>
                                    <option value="Open box">Open box</option>
                                    <option value="New - Open box">New - Open box</option>
                                    {/* <option value="Very Good">Very Good</option>
                                    <option value="Preowned">Preowned</option>
                                    <option value="Used">Used</option> */}
                                </select>
                            </div>
                            {FiltersData.find((cat) => cat.category === category)?.haveSize && (
                                <div className="flex items-center gap-3 w-40">
                                    <select className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body" onChange={(e) => handleSizeChange(e)} value={size}>
                                        <option value="">Any Size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                        <option value="XXXL">XXXL</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex items-center gap-3 w-[45%] md:w-40">
                                {/* <span className="text-sm font-medium text-[#6b5b4f] font-luxury">Location:</span> */}
                                <select className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body" onChange={(e) => handleConditionChange(e)} value={condition}>
                                    <option value="">Any Location</option>
                                    <option value="US">US</option>
                                    <option value="UK">UK</option>
                                </select>
                            </div>
                            {FiltersData.find((cat) => cat.category === category)?.haveGender && (
                                <div className="flex items-center gap-3 w-40">
                                    {/* <span className="text-sm font-medium text-[#6b5b4f] font-luxury">Gender:</span> */}
                                    <select className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body" onChange={(e) => handleGenderChange(e)} value={gender}>
                                        <option value="">Any Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Unisex">Unisex</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex items-center gap-3 w-[45%] md:w-40">
                                {/* <span className="text-sm font-medium text-[#6b5b4f] font-luxury">Price:</span> */}
                                <select className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body" onChange={(e) => handlePriceChange(e)} value={price}>
                                    <option value="">Any Price</option>
                                    <option value="0-200">Under $200</option>
                                    <option value="200-400">$200 - $400</option>
                                    <option value="400-600">$400 - $600</option>
                                    <option value="600+">$600+</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Header */}
            <div className="bg-[#fefdfb] px-4 md:px-10 py-4 border-b border-[#d4c4b0]">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="text-sm text-[#6b5b4f] font-body">
                        <span className="text-[#a67c52] font-medium">{currentPagination.totalProducts}</span> results
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
                    <h1 className="text-2xl font-semibold text-[#2c1810] mb-8 font-luxury">{searchQuery ? `Search results for "${searchQuery}"` : `${category ? category : ""} ${category&&brand ? "-" : ""} ${brand ? brand : ""} ${category || brand ? "-" : ""} ${currentPagination.totalProducts} results`}</h1>
                    {currentPagination.totalProducts === 0 && (
                        <div className="text-center text-lg text-[#6b5b4f] font-body h-32 flex items-center justify-center">No products found</div>
                    )}
                    <div
                        className={`grid gap-8 transition-all duration-300 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                            }`}
                    >
                        {currentProducts.map((product: ProductInterface) => (
                            <div
                                key={product._id}
                                className={`bg-white px-2 rounded-xl overflow-hidden shadow-sm border border-[#d4c4b0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer card-luxury ${viewMode === "list" ? "flex flex-row h-40" : ""
                                    }`}
                            >
                                <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-80"}`}>
                                    {/* Heart Save Button - Only show if user is logged in */}
                                    {/* {handleGetUser() && ( */}
                                    <button
                                        onClick={(e) => toggleSaveProduct(product._id, e)}
                                        className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${savedProducts.has(product._id)
                                            ? "bg-red-500 text-white shadow-lg"
                                            : "bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100 hover:text-red-500"
                                            }`}
                                    >
                                        <Heart className={`w-4 h-4 ${savedProducts.has(product._id) ? "fill-current" : ""}`} />
                                    </button>
                                    {/* )}   */}

                                    <Link href={`/product/${product._id}`} className="w-full h-full bg-[#f4f0eb] flex items-center justify-center cursor-pointer hover:bg-[#f0ebe6] transition-colors">
                                        <img
                                            src={product.images[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            className="w-full h-full object-contain bg-white"
                                        />
                                    </Link>
                                </div>

                                <Link href={`/product/${product._id}`} className={`p-5 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
                                    {/* <div className="text-xs text-[#8a7960] uppercase tracking-wide mb-2 font-luxury">{product.brand} {product._id}</div> */}
                                    <h3
                                        className={`text-[#2c1810] font-medium mb-2 line-clamp-2 font-body ${viewMode === "list" ? "text-lg" : "text-base"
                                            }`}
                                    >
                                        {product.name}
                                    </h3>
                                    <div
                                        className={`text-[#a67c52] font-semibold font-luxury ${viewMode === "list" ? "text-xl" : "text-lg"}`}
                                    >
                                        {product?.price ? product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "100"} {product?.currency ? product.currency : ""}
                                    </div>
                                    <div className="text-xs text-[#6b5b4f] mt-2 font-body">Direct Shipping • {product.location ?? ""}</div>
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
                                    className={`p-2 rounded-md border transition-colors ${currentPagination.hasPrevPage && !isLoading
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
                                                        className={`px-3 py-2 rounded-md border transition-colors ${page === currentPagination.currentPage
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
                                    className={`p-2 rounded-md border transition-colors ${currentPagination.hasNextPage && !isLoading
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
                        <div className="mt-8 flex justify-center h-32">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-[#a67c52] animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#a67c52] animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#a67c52] animate-bounce"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} mode={'login'} />
        </Layout>
    )
}

export async function getServerSideProps(context: any) {
    const {
        q = "",
        category = "",
        brand = "",
        condition = "",
        size = "",
        location = "",
        gender = "",
        price = "",
    } = context.query;

    const limit = 50;
    let products = [];
    let pagination = {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit,
    };

    try {
        const response = await GetData(
            Endpoints.product.getProducts(
                q,
                1,
                limit,
                category,
                brand,
                condition,
                size,
                location,
                gender,
                price
            )
        );

        if (response?.products?.length > 0) {
            products = response.products;
            pagination = response.pagination;
        }
    } catch (error) {
        console.error("SSR fetch error:", error);
    }

    return {
        props: {
            initialProducts: products,
            initialPagination: pagination,
        },
    };
}
