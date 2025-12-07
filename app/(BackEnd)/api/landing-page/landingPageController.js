import connectDB from "@/dataBase/db"
import { LandingPage } from "@/dataBase/models/LandingPage"
import { Query } from "@/dataBase/models/Queries"
import mongoose from "mongoose"

function normalizeBody(input) {
  // Accept both capitalized and camelCase keys and normalize to schema keys
  const title = input.Title ?? input.title
  const slug = (input.Slug ?? input.slug)?.toString().trim().toLowerCase()
  const filters = input.Filters ?? input.filters ?? {}
  const isDeleted = input.IsDeleted ?? input.isDeleted ?? false
  // Don't set status - let schema default handle it (defaults to 'fetching')
  const boostedProducts = input.BoostedProducts ?? input.boostedProducts ?? []
  const deletedProjects = input.DeletedProjects ?? input.deletedProjects ?? []
  const queries = input.Queries ?? input.queries ?? []

  return { title, slug, filters, isDeleted, boostedProducts, deletedProjects, queries }
}

async function createLandingPage(body) {
  try {
    await connectDB()

    const data = normalizeBody(body)

    if (!data.title || !data.slug) {
      return { status: 400, message: "Title and Slug are required" }
    }

    const exists = await LandingPage.findOne({ slug: data.slug })
    if (exists) {
      return { status: 409, message: "Slug must be unique" }
    }

    const created = await LandingPage.create(data)
    
    // Create Query documents if queries are provided
    if (data.queries && Array.isArray(data.queries) && data.queries.length > 0) {
      const validQueries = data.queries.filter(q => q.query && q.range)
      
      if (validQueries.length > 0) {
        try {
          for (const q of validQueries) {
            const limitValue = parseInt(q.range) || Number(q.range) || 0
            
            await Query.create({
              query: q.query,
              landingPageId: created._id,
              limit: limitValue,
              status: "pending"
            })
          }
        } catch (queryError) {
          console.error("Error creating queries:", queryError)
          // Don't fail the landing page creation if queries fail
        }
      }
    }
    
    return {
      status: 201,
      message: "Landing page created successfully",
      data: created,
    }
  } catch (error) {
    console.log("createLandingPage error", error)
    return { status: 500, message: "Failed to create landing page" }
  }
}

async function deleteLandingPage(id, userId) {
  // Temporary: Skip admin check if no userId provided (will enable auth later)
  // if (userId) {
  //   const adminCheck = await checkAdmin(userId);
  //   if (adminCheck) return adminCheck;
  // }
  try {
    await connectDB()
    
    // First, find the landing page to ensure it exists
    const landingPage = await LandingPage.findById(id)
    if (!landingPage) {
      return {
        status: 404,
        message: 'Landing page not found'
      }
    }
    
    // Delete all queries associated with this landing page
    try {
      const deleteResult = await Query.deleteMany({ landingPageId: id })
      console.log(`Deleted ${deleteResult.deletedCount} query/queries associated with landing page ${id}`)
    } catch (queryError) {
      console.error("Error deleting associated queries:", queryError)
      // Continue with landing page deletion even if query deletion fails
    }
    
    // Now delete the landing page
    await LandingPage.findByIdAndDelete(id)
    
    return {
      status: 200,
      message: 'Landing page and associated queries deleted successfully',
      data: landingPage
    }
  } catch (error) {
    console.log("deleteLandingPage error", error)
    throw error
  }
}

export { createLandingPage, deleteLandingPage }


