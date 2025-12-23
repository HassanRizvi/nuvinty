import { getAllQueries } from "../querieController";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const landingPageId = searchParams.get("landingPageId");
  
  // Allow requests without userId if landingPageId is provided
  if (!userId && !landingPageId) {
    return new Response(JSON.stringify({ error: "Missing userId or landingPageId parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  // Build filter object from query params
  const filter = {};
  // Numeric/date fields to support range
  const rangeFields = [
    "pages_processed",
    "total_pages",
    "total_products",
    "products_processed",
    "products_failed",
    "last_updated",
    "createdAt",
    "updatedAt"
  ];
  for (const field of rangeFields) {
    const min = searchParams.get(`${field}_min`);
    const max = searchParams.get(`${field}_max`);
    if (min || max) {
      filter[field] = {};
      if (min) filter[field]["$gte"] = isNaN(Date.parse(min)) ? Number(min) : new Date(min);
      if (max) filter[field]["$lte"] = isNaN(Date.parse(max)) ? Number(max) : new Date(max);
    }
  }
  // Exact match for string fields
  const stringFields = ["query", "status"];
  for (const field of stringFields) {
    const value = searchParams.get(field);
    if (value) filter[field] = value;
  }
  
  // Handle landingPageId (ObjectId) - already declared above
  if (landingPageId) {
    try {
      const mongoose = await import("mongoose");
      filter.landingPageId = new mongoose.default.Types.ObjectId(landingPageId);
    } catch (error) {
      console.error("Invalid landingPageId:", error);
    }
  }

  try {
    const response = await getAllQueries(userId || null, filter);
    return new Response(JSON.stringify(response), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("getAllQueries error", error);
    return new Response(JSON.stringify({ error: "Failed to get queries" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
} 