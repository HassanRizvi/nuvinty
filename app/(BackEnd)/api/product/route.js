import connectDB from "@/dataBase/db";
import { Product } from "@/dataBase/models/Products";

export async function GET(request) {
    await connectDB();
    
    // Get the search query and pagination params from URL params
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    // Create search filter for product name using case-insensitive regex
    const searchFilter = searchQuery ? {
        name: { $regex: searchQuery, $options: 'i' }
    } : {};

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(searchFilter);

    // Get paginated products
    const products = await Product.find(searchFilter)
        .skip(skip)
        .limit(limit)
     //   .sort({ createdAt: -1, _id: -1 }); // Sort by newest first

    const totalPages = Math.ceil(totalProducts / limit);

    return Response.json({ 
        products,
        pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            limit
        }
    });
}