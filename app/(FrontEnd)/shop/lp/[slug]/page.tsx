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

async function getProductsByQueries(queries: Array<{ query: string; range: string }>) {
  try {
    const allProducts: any[] = []
    const seenProductIds = new Set<string>()

    // Fetch products for each query
    for (const queryItem of queries) {
      const queryText = queryItem.query
      const rangeLimit = parseInt(queryItem.range) || 100 // Default to 100 if invalid
      
      // Fetch products using the query as search term
      // Use a high limit to get all products, then limit to range
      const response = await GetData(
        Endpoints.product.getProducts(
          queryText,
          1,
          rangeLimit, // Use range as limit
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        )
      )

      if (response?.products && Array.isArray(response.products)) {
        // Add products that haven't been seen yet (avoid duplicates)
        for (const product of response.products) {
          const productId = product._id?.toString() || product.id?.toString()
          if (productId && !seenProductIds.has(productId)) {
            seenProductIds.add(productId)
            allProducts.push(product)
          }
        }
      }
    }

    return {
      products: allProducts,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: allProducts.length,
        hasNextPage: false,
        hasPrevPage: false,
        limit: allProducts.length,
      }
    }
  } catch (error) {
    console.error("Error fetching products by queries:", error)
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
    // Use queries if available
    productsData = await getProductsByQueries(landingPage.queries)
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
    />
  )
}

