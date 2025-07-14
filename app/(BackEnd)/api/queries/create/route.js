import { createQuery } from "../querieController";
import { corsHeaders, handleOptions } from "@/lib/cors"; // ✅ import reusable helpers

// ✅ Handle preflight requests
export async function OPTIONS() {
  return handleOptions();
}

// ✅ Main handler
export async function POST(request) {
  try {
    const body = await request.json();
    const response = await createQuery(body);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ add CORS headers
      },
    });
  } catch (error) {
    console.error("createQuery error", error);

    return new Response(JSON.stringify({ error: "Failed to create query" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ add CORS headers even on error
      },
    });
  }
}
