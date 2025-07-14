import { addToFav, getFav } from "../userController";
import { corsHeaders, handleOptions } from "@/lib/cors"; // ✅ import CORS utilities

// ✅ Preflight handler (required for POST and safe for GET)
export async function OPTIONS() {
  return handleOptions();
}

// ✅ POST: Add to favorites
export async function POST(request) {
  try {
    const body = await request.json();
    const response = await addToFav(body);

    return new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ attach CORS headers
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: "Failed to sign in user" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ on error too
      },
    });
  }
}

// ✅ GET: Get all favorites
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const response = await getFav({ userId });

    return new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: "Failed to get favorites" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}
