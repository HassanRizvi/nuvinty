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

async function getProductsByQueryIds(landingPageId: string) {
  try {
    // Step 1: Fetch queries for this landing page
    const queriesRes = await GetData({ 
      url: `${BaseUrl}/queries/all?landingPageId=${landingPageId}`, 
      method: "GET" 
    })
    
    if (queriesRes?.status === 200 && queriesRes.data && Array.isArray(queriesRes.data) && queriesRes.data.length > 0) {
      // Step 2: Get all query IDs
      const queryIds = queriesRes.data
        .map((q: any) => q._id?.toString() || q.id?.toString())
        .filter((id: string) => id && id.trim() !== "")
      
      if (queryIds.length === 0) {
        return { products: [], pagination: {} }
      }

      // Step 3: Fetch products where queryId matches any of these query IDs
      const queryIdsParam = queryIds.join(",")
      const productsUrl = `${BaseUrl}/product?queryIds=${encodeURIComponent(queryIdsParam)}&page=1&limit=10000`
      
      const productsRes = await GetData({ url: productsUrl, method: "GET" })
      
      if (productsRes?.products && Array.isArray(productsRes.products)) {
        return {
          products: productsRes.products,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalProducts: productsRes.products.length,
            hasNextPage: false,
            hasPrevPage: false,
            limit: productsRes.products.length,
          }
        }
      }
    }
    
    return { products: [], pagination: {} }
  } catch (error) {
    console.error("Error fetching products by query IDs:", error)
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

  // Only allow access if landing page status is "active"
  if (landingPage.status !== "active") {
    notFound()
  }

  // Fetch products based on landing page queries or filters
  let productsData
  if (landingPage.queries && Array.isArray(landingPage.queries) && landingPage.queries.length > 0) {
    // Use queryIds to fetch products - get products that have queryId matching landing page's queries
    const landingPageId = landingPage._id?.toString() || landingPage.id?.toString()
    if (landingPageId) {
      productsData = await getProductsByQueryIds(landingPageId)
    } else {
      productsData = { products: [], pagination: {} }
    }
  } else {
    // Fall back to filters if no queries
    productsData = await getProductsByFilters(landingPage.filters || {})
  }
  
  // Get deleted and boosted product IDs from landing page
  const deletedProductIds = landingPage.deletedProjects?.map((id: any) => id.toString()) || []
  const boostedProductIds = landingPage.boostedProducts?.map((id: any) => id.toString()) || []
  
  // Filter out deleted products
  let filteredProducts = (productsData.products || []).filter(
    (product: any) => {
      const productId = product._id?.toString() || product.id?.toString()
      return productId && !deletedProductIds.includes(productId)
    }
  )
  
  // Sort products: boosted products first, then the rest
  filteredProducts = filteredProducts.sort((a: any, b: any) => {
    const aId = a._id?.toString() || a.id?.toString()
    const bId = b._id?.toString() || b.id?.toString()
    const aIsBoosted = aId && boostedProductIds.includes(aId)
    const bIsBoosted = bId && boostedProductIds.includes(bId)
    
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
      landingPageTitle={landingPage.title}
    />
  )
}

