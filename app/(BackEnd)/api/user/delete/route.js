import { deleteUser } from "../userController";
import { corsHeaders, handleOptions } from "@/lib/cors";

// Preflight handler for browser
export async function OPTIONS() {
  return handleOptions();
}

// DELETE: Delete user by ID with CORS support
export async function DELETE(request) {
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

    const response = await deleteUser({ userId });

    return new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: "Failed to delete user" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
} 