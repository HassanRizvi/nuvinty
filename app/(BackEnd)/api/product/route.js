import connectDB from "@/dataBase/db";
import { Product } from "@/dataBase/models/Products";

export async function GET(request) {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    // Build aggregation pipeline
    const pipeline = [];

    if (searchQuery) {
        pipeline.push({
            $search: {
                index: "productIndex",
                text: {
                    query: searchQuery,
                    path: ["name","brand","category","material","color"],
                    fuzzy: {
                        maxEdits: 2,   // Allows for up to 2 typos
                        prefixLength: 1 // First 1 letter must match
                    }
                }

            }
        });
    }

    pipeline.push(
        {
            $facet: {
                paginatedResults: [
                    { $skip: skip },
                    { $limit: limit }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        }
    );

    const result = await Product.aggregate(pipeline);

    const products = result[0]?.paginatedResults || [];
    const totalProducts = result[0]?.totalCount[0]?.count || 0;
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
