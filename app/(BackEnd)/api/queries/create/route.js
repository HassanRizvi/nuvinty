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
    const userId = body.userId;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId parameter" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
    const response = await createQuery(body, userId);
    return new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("createQuery error", error);
    return new Response(JSON.stringify({ error: "Failed to create query" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}
