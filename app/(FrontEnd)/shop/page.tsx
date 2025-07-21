import Shop from "./shop"
import { GetData } from "@/helper/general"
import { Endpoints } from "@/config"

export const dynamic = 'force-dynamic'

interface ShopPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const {
    q = "",
    category = "",
    brand = "",
    condition = "",
    size = "",
    location = "",
    gender = "",
    price = "",
  } = searchParams || {};

  const limit = 12;
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
        typeof q === 'string' ? q : "",
        1,
        limit,
        typeof category === 'string' ? category : "",
        typeof brand === 'string' ? brand : "",
        typeof condition === 'string' ? condition : "",
        typeof size === 'string' ? size : "",
        typeof location === 'string' ? location : "",
        typeof gender === 'string' ? gender : "",
        typeof price === 'string' ? price : ""
      )
    );

    if (response?.products?.length > 0) {
      products = response.products;
      pagination = response.pagination;
    }
  } catch (error) {
    console.error("SSR fetch error:", error);
  }

  return (
    <Shop
      products={products}
      pagination={pagination}
      initialFilters={{
        q: typeof q === 'string' ? q : "",
        category: typeof category === 'string' ? category : "",
        brand: typeof brand === 'string' ? brand : "",
        condition: typeof condition === 'string' ? condition : "",
        size: typeof size === 'string' ? size : "",
        location: typeof location === 'string' ? location : "",
        gender: typeof gender === 'string' ? gender : "",
        price: typeof price === 'string' ? price : "",
      }}
    />
  );
} 