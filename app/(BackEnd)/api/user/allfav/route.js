import { getAllFav } from "../userController";
import { corsHeaders, handleOptions } from "@/lib/cors"; // ✅ import CORS helpers

// ✅ Preflight CORS handler (still needed even for GETs sometimes)
export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "12";

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders, // ✅ add CORS headers
        },
      });
    }

    const response = await getAllFav({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ add CORS headers
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to get favorites" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders, // ✅ add CORS headers on error too
        },
      }
    );
  }
}
