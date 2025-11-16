"use client"
import { useEffect, useState } from "react"
import DataTable from "@/components/admin/DataTable"
import { Endpoints } from "@/config"
import { GetData } from "@/helper/general"

type Product = {
  _id: string
  name: string
  brand: string
  price: string
  createdAt: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadProducts = async (currentPage: number) => {
    const res = await GetData(Endpoints.product.getProducts('', currentPage, 12))
    if (res?.products) {
      setProducts(res.products)
      setTotalPages(res.pagination?.totalPages || 1)
    }
  }

  useEffect(() => {
    loadProducts(page)
  }, [page])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Products</h1>
      <DataTable
        data={products}
        columns={[
          { key: "brand", header: "Brand" },
          { key: "condition", header: "Condition" },
          { key: "price", header: "Price" },
        ]}
        searchPlaceholder="Search products"
        onCreate={() => {}}
        createLabel="New Product"
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}


