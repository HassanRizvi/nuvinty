import { getUser } from "../userController";
import { corsHeaders, handleOptions } from "@/lib/cors"; // ✅ import your shared CORS helpers

// ✅ Preflight handler for browser (even GETs can trigger OPTIONS if credentials or headers involved)
export async function OPTIONS() {
  return handleOptions();
}

// ✅ GET: Get user by ID with CORS support
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const response = await getUser({ userId });

    return new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ Add CORS headers
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: "Failed to get user" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ Even on errors
      },
    });
  }
}
