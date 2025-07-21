"use client"
import { GetData, handleGetUser } from "@/helper/general"
import Saved from "./saved"
import { Endpoints } from "@/config"
import { useEffect, useState } from "react"

export default function SaveProductPage() {
    const [products, setProducts] = useState({
        data: [],
        pagination: { currentPage: 1, totalPages: 0, totalProducts: 0, hasNextPage: false, hasPrevPage: false, limit: 12 }
    })

    const handleGetProducts = async () => {
        try {
            console.log("In Get Saved Products ")
            const user = handleGetUser()
            console.log("user from Function ", user)
            if (user && user._id) {
                const products = await GetData(Endpoints.user.getAllFav(user._id, 1, 12))
                console.log("products saved from Function ", products)
                return products
            }
            return { data: [], pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 } }
        } catch (error) {
            console.error("Error fetching products:", error)
            return { data: [], pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 } }
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            const productsData = await handleGetProducts()
            setProducts(productsData)
        }
        fetchProducts()
    }, [])

    return <Saved products={products.data} pagination={products.pagination} />
}