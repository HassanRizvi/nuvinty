import connectDB from "@/dataBase/db";
import { Product } from "@/dataBase/models/Products";
import { handleOptions, withCORS } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 12;
  const skip = (page - 1) * limit;

  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const condition = searchParams.get("condition") || "";
  const location = searchParams.get("location") || "";
  const price = searchParams.get("price") || "";

  const pipeline = [];

  // Build $search compound queries
  const searchConditions = [];

  if (searchQuery) {
    searchConditions.push({
      text: {
        query: searchQuery,
        path: ["name"],
        fuzzy: { maxEdits: 2, prefixLength: 1 },
      },
    });
  }

  if (category) {
    searchConditions.push({
      text: {
        query: category,
        path: ["category"],
        fuzzy: { maxEdits: 2, prefixLength: 1 },
      },
    });
  }

  if (brand) {
    searchConditions.push({
      text: {
        query: brand,
        path: ["brand"],
        fuzzy: { maxEdits: 2, prefixLength: 1 },
      },
    });
  }

  if (condition) {
    searchConditions.push({
      text: {
        query: condition,
        path: ["condition"],
        // analyzer: "lucene.standard"
        // fuzzy: { maxEdits: 2, prefixLength: 1 },
        // caseSensitive: false,
      },
    });
  }

  if (location) {
    searchConditions.push({
      text: {
        query: location,
        path: ["location"],
        fuzzy: { maxEdits: 2, prefixLength: 1 },
      },
    });
  }

  // Add $search only if we have filters
  if (searchConditions.length > 0) {
    pipeline.push({
      $search: {
        index: "productIndex",
        compound: {
          must: searchConditions,
        },
      },
    });
  }

  // Handle price range
  if (price) {
    const [minPriceStr, maxPriceStr] = price.split("-");
    const minPrice = parseFloat(minPriceStr);
    const maxPrice = parseFloat(maxPriceStr);

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      pipeline.push({
        $match: {
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$price" }, minPrice] },
              { $lte: [{ $toDouble: "$price" }, maxPrice] },
            ],
          },
        },
      });
    }
  }

  // Pagination + total count
  pipeline.push({
    $facet: {
      paginatedResults: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await Product.aggregate(pipeline);

  const products = result[0]?.paginatedResults || [];
  const totalProducts = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalProducts / limit);

  return withCORS({
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit,
    },
  });
}
