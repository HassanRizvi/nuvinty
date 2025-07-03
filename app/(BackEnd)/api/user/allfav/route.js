import { getAllFav } from "../userController";
import { NextResponse } from "next/server"

// export async function GET(request) {
//     try {
//         await connectDB()

//         // Get userId from query params
//         const { searchParams } = new URL(request.url)
//         const userId = searchParams.get("userId")

//         if (!userId) {
//             return NextResponse.json({ error: "User ID is required" }, { status: 400 })
//         }

//         // Find user and get their liked products
//         const user = await User.findById(userId)
//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 })
//         }

//         // Get full product details for all liked products
//         const likedProducts = await Product.find({
//             _id: { $in: user.likedProducts }
//         })

//         return NextResponse.json(likedProducts, { status: 200 })

//     } catch (error) {
//         console.error("Error fetching liked products:", error)
//         return NextResponse.json(
//             { error: "Failed to fetch liked products" },
//             { status: 500 }
//         )
//     }
// }

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const page = searchParams.get('page') || '1'
        const limit = searchParams.get('limit') || '12'

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }

        const response = await getAllFav({ 
            userId, 
            page: parseInt(page), 
            limit: parseInt(limit) 
        })
        return NextResponse.json(response, { status: response.status })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to get favorites' }, { status: 500 })
    }
}