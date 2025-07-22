import { GetData } from "@/helper/general"
import { Endpoints } from "@/config"
import ProductDetail from "./productDetail"
import { notFound } from "next/navigation"

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const handleGetProduct = async (productId: string) => {
    try {
      const response = await GetData(Endpoints.product.getProductById(productId))
      return response
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  }

  const product = await handleGetProduct(id)
  console.log("Fetched product:", product)

  if (!product || !product.data) {
    notFound()
  }

  return <ProductDetail product={product.data} />
} 