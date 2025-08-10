import { User } from "@/dataBase/models/Users"
import connectDB from "@/dataBase/db"
import { Product } from "@/dataBase/models/Products"
async function addToFav(body) {
    try {
        await connectDB()
        const user = await User.findById(body.userId)
        if (!user) {
            return {
                status: 404,
                message: "User not found"
            }
        }

        // Toggle the product in likedProducts
        const productIndex = user.likedProducts.indexOf(body.productId)
        if (productIndex > -1) {
            // Remove product if it exists
            user.likedProducts.splice(productIndex, 1)
        } else {
            // Add product if it doesn't exist
            user.likedProducts.push(body.productId)
        }

        await user.save()
        return {
            status: 200,
            message: productIndex > -1 ? "Product removed from fav" : "Product added to fav",
            data: user.likedProducts
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Failed to update favorites"
        }
    }
}
async function getFav(body) {
    try {
        await connectDB()
        const user = await User.findById(body.userId)
        if (!user) {
            return {
                status: 404,
                message: "User not found"
            }
        }
        return {
            status: 200,
            message: "Fav products",
            data: user.likedProducts
        }
    } catch (error) {
        console.log(error)
    }
}
async function getAllFav(body) {
    try {
        await connectDB()
        const user = await User.findById(body.userId)
        if (!user) {
            return {
                status: 404,
                message: "User not found"
            }
        }

        // Pagination parameters
        const page = parseInt(body.page) || 1
        const limit = parseInt(body.limit) || 12
        const skip = (page - 1) * limit

        // Get total count for pagination
        const totalProducts = await Product.countDocuments({
            _id: { $in: user.likedProducts }
        })

        // Get paginated products
        const products = await Product.find({
            _id: { $in: user.likedProducts }
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }) // Sort by newest first

        const totalPages = Math.ceil(totalProducts / limit)

        return {
            status: 200,
            message: "All fav products",
            data: products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            }
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Failed to fetch favorites"
        }
    }
}
async function getUser(body) {
    try {
        await connectDB()
        const user = await User.findById(body.userId)
        if (!user) {
            return {
                status: 404,
                message: "User not found"
            }
        }
        const filteredUser = {
            role: user.role,
            name: user.name,
            email: user.email
        }
        return {
            status: 200,
            message: "User",
            data: filteredUser
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Failed to fetch user"
        }
    }
}

async function deleteUser(body) {
    try {
        await connectDB()
        const user = await User.findByIdAndDelete(body.userId)
        if (!user) {
            return {
                status: 404,
                message: "User not found"
            }
        }
        return {
            status: 200,
            message: "User deleted successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Failed to delete user"
        }
    }
}

export { addToFav, getFav, getAllFav, getUser, deleteUser }