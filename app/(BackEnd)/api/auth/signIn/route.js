import { signIn } from "../authController";
import { NextResponse } from "next/server";
import { corsHeaders, handleOptions } from "@/lib/cors"; // ✅ import your shared CORS utils

// ✅ Handle preflight CORS requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// ✅ Handle POST sign-in
export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);

    const response = await signIn(body);

    return new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders, // ✅ attach CORS headers
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to sign in user" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders, // ✅ attach CORS headers on error too
        },
      }
    );
  }
}
