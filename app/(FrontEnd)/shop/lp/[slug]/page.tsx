import { GetData } from "@/helper/general"
import { BaseUrl, Endpoints } from "@/config"
import { notFound } from "next/navigation"
import Shop from "@/app/(FrontEnd)/shop/shop"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
  }
}

async function getLandingPageBySlug(slug: string) {
  try {
    const response = await GetData({ 
      url: `${BaseUrl}/landing-page?q=${slug}`, 
      method: "GET" 
    })
    
    if (response?.status === 200 && response.data?.length > 0) {
      // Find exact slug match
      const landingPage = response.data.find((lp: any) => lp.slug === slug)
      return landingPage || null
    }
    return null
  } catch (error) {
    console.error("Error fetching landing page:", error)
    return null
  }
}

async function getProductsByFilters(filters: any, page = 1) {
  try {
    const response = await GetData(
      Endpoints.product.getProducts(
        "",
        page,
        12,
        filters.category || "",
        filters.brand || "",
        filters.condition || "",
        filters.size || "",
        "",
        filters.gender || "",
        filters.price || ""
      )
    )
    return response
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], pagination: {} }
  }
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params
  
  // Fetch landing page data
  const landingPage = await getLandingPageBySlug(slug)
  
  if (!landingPage) {
    notFound()
  }

  // Fetch products based on landing page filters
  const productsData = await getProductsByFilters(landingPage.filters || {})
  
  // Get deleted and boosted product IDs from landing page
  const deletedProductIds = landingPage.deletedProjects?.map((id: any) => id.toString()) || []
  const boostedProductIds = landingPage.boostedProducts?.map((id: any) => id.toString()) || []
  
  // Filter out deleted products
  let filteredProducts = (productsData.products || []).filter(
    (product: any) => !deletedProductIds.includes(product._id.toString())
  )
  
  // Sort products: boosted products first, then the rest
  filteredProducts = filteredProducts.sort((a: any, b: any) => {
    const aIsBoosted = boostedProductIds.includes(a._id.toString())
    const bIsBoosted = boostedProductIds.includes(b._id.toString())
    
    if (aIsBoosted && !bIsBoosted) return -1
    if (!aIsBoosted && bIsBoosted) return 1
    return 0
  })

  return (
    <Shop
      products={filteredProducts}
      pagination={productsData.pagination ? {
        ...productsData.pagination,
        totalProducts: filteredProducts.length,
      } : {
        currentPage: 1,
        totalPages: 1,
        totalProducts: filteredProducts.length,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 12,
      }}
      initialFilters={{
        category: landingPage.filters?.category || "",
        brand: landingPage.filters?.brand || "",
        condition: landingPage.filters?.condition || "",
        size: landingPage.filters?.size || "",
        gender: landingPage.filters?.gender || "",
        price: landingPage.filters?.price || "",
      }}
      hideFilters={true}
    />
  )
}

