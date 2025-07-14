import { signUp } from "../authController";
import { corsHeaders, handleOptions } from "@/lib/cors"; // ✅ import your reusable CORS helpers

// ✅ Preflight handler
export async function OPTIONS() {
  return handleOptions();
}

// ✅ Sign-Up POST handler
export async function POST(request) {
  try {
    const body = await request.json();
    const response = await signUp(body);

    return new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ add CORS headers
      },
    });
  } catch (error) {
    let status = 500;
    let errorMessage = "Failed to create user";

    if (error.code === 11000) {
      errorMessage = "Email already exists";
      status = 400;
    }

    console.error("SignUp error", error);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ add CORS headers even on errors
      },
    });
  }
}
