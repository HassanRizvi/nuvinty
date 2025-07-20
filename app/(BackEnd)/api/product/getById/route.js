import connectDB from "@/dataBase/db";
import { Product } from "@/dataBase/models/Products";
import { corsHeaders, handleOptions, withCORS } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("id");

  if (!productId) {
    return new Response(JSON.stringify({ error: "Product ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    return withCORS({
      status: 200,
      message: "Product found",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch product" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
} 