import Shop from "./shop"
import { GetData } from "@/helper/general"
import { Endpoints } from "@/config"
import { ProductInterface } from "@/types/productInterface"

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const handleGetProducts = async () => {
    try {
      console.log("BaseUrl", process.env.NEXT_PUBLIC_BASE_URL)
      const products = await GetData(Endpoints.product.getProducts("", 1, 20))
      console.log("Products IDs of page :", {}, products.products.map((product: ProductInterface) => product._id))
      return products
    } catch (error) {
      console.error("Error fetching products:", error)
      return { 
        products: [], 
        pagination: { 
          currentPage: 1, 
          totalPages: 1, 
          totalProducts: 0, 
          hasNextPage: false, 
          hasPrevPage: false, 
          limit: 20 
        } 
      }
    }
  }

  const products = await handleGetProducts()
  return <Shop products={products.products} pagination={products.pagination} />
} 