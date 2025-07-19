import connectDB from "@/dataBase/db";
import { Product } from "@/dataBase/models/Products";
import { corsHeaders, handleOptions, withCORS } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions(); // ✅ handles preflight
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
  // const size = searchParams.get("size") || "";
  // const gender = searchParams.get("gender") || "";

  const pipeline = [];

  if (searchQuery) {
    // pipeline.push({
    //   $match: { name: searchQuery },
    // });
    pipeline.push({
      $search: {
        index: "productIndex",
        text: {
          query: searchQuery,
          path: ["name"],
          fuzzy: { maxEdits: 2, prefixLength: 1 },
        },
      },
    });
  }

  if (category) {
    pipeline.push({
      $match: { category: category },
    });
  }

  if (brand) {
    pipeline.push({
      $match: { brand: brand },
    });
  }

  if (condition) {
    pipeline.push({
      $match: { condition: condition },
    });
  }

  if (location) {
    pipeline.push({
      $match: { location: location },
    });
  }
  if (price) {
    const Newprice = price.toString();
    const [minPriceStr, maxPriceStr] = Newprice.split("-");
    const minPrice = parseFloat(minPriceStr);
    const maxPrice = parseFloat(maxPriceStr);

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      console.log("Min Price ", minPrice, "Max Price ", maxPrice);

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
    } else {
      console.log("Invalid price range");
    }
  } else {
    console.log("Don't have price");
  }



  // if (gender) {
  //   pipeline.push({
  //     $match: { gender: gender },
  //   });
  // }



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
