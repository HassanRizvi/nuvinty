export const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // 👈 or use "*" in dev
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    // Uncomment if you're using cookies or tokens
    // "Access-Control-Allow-Credentials": "true"
  };
  
  export function handleOptions() {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  export function withCORS(jsonData, status = 200) {
    return new Response(JSON.stringify(jsonData), {
      status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
  