import { GetData, handleGetUser } from "@/helper/general"
import Saved from "./saved"
import { Endpoints } from "@/config"

export default async function SaveProductPage() {
    const handleGetProducts = async () => {
        try {
        const user = await handleGetUser()
        if (user && user._id) {
            const products = await GetData(Endpoints.user.getAllFav(user._id, 1, 12))
            return products
            }
            return { data: [], pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 } }
        } catch (error) {
            console.error("Error fetching products:", error)
            return { data: [], pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 } }
        }
    }
    const products = await handleGetProducts()
    return <Saved products={products.data} pagination={products.pagination} />
}