import connectDB from "@/dataBase/db"
import { Product } from "@/dataBase/models/Products"
import { User } from "@/dataBase/models/Users"

async function checkAdmin(userId) {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
        return { status: 404, message: 'User not found' };
    }
    if (user.role !== 'admin') {
        return { status: 403, message: 'Forbidden: Admins only' };
    }
    return null;
}

async function deleteProduct(productId, userId) {
    const adminCheck = await checkAdmin(userId);
    if (adminCheck) return adminCheck;
    
    try {
        await connectDB()
        const product = await Product.findByIdAndDelete(productId)
        if (!product) {
            return {
                status: 404,
                message: 'Product not found'
            }
        }
        return {
            status: 200,
            message: 'Product deleted successfully',
            data: product
        }
    } catch (error) {
        console.log("deleteProduct error", error)
        return {
            status: 500,
            message: 'Failed to delete product'
        }
    }
}

export { deleteProduct } 