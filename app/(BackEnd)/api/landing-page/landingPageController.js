import connectDB from "@/dataBase/db"
import { LandingPage } from "@/dataBase/models/LandingPage"

function normalizeBody(input) {
  // Accept both capitalized and camelCase keys and normalize to schema keys
  const title = input.Title ?? input.title
  const slug = (input.Slug ?? input.slug)?.toString().trim().toLowerCase()
  const filters = input.Filters ?? input.filters ?? {}
  const isDeleted = input.IsDeleted ?? input.isDeleted ?? false
  const statusRaw = input.Status ?? input.status ?? "draft"
  const status = statusRaw.toString().toLowerCase()
  const boostedProducts = input.BoostedProducts ?? input.boostedProducts ?? []
  const deletedProjects = input.DeletedProjects ?? input.deletedProjects ?? []

  return { title, slug, filters, isDeleted, status, boostedProducts, deletedProjects }
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

export { createLandingPage }


