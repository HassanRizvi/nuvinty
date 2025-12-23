import { NextResponse } from 'next/server'
import { createLandingPage, updateLandingPage } from './landingPageController'
import connectDB from '@/dataBase/db'
import { LandingPage } from '@/dataBase/models/LandingPage'
import { Query } from '@/dataBase/models/Queries'

export async function POST(request) {
  try {
    const body = await request.json()
    const result = await createLandingPage(body)
    return NextResponse.json(result, { status: result.status })
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Invalid JSON body' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const q = (searchParams.get('q') || '').trim()
    const status = (searchParams.get('status') || '').trim().toLowerCase()

    const filter = {}
    if (q) Object.assign(filter, { $or: [{ title: { $regex: q, $options: 'i' } }, { slug: { $regex: q, $options: 'i' } }] })
    if (status) Object.assign(filter, { status })

    const [total, items] = await Promise.all([
      LandingPage.countDocuments(filter),
      LandingPage.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    ])

    // Get query statistics for each landing page and auto-update status
    const itemsWithQueryStats = await Promise.all(
      items.map(async (item) => {
        const itemObj = item.toObject ? item.toObject() : item
        const landingPageId = itemObj._id?.toString() || itemObj.id?.toString()
        
        if (landingPageId) {
          try {
            // Count total queries for this landing page
            const totalQueries = await Query.countDocuments({ landingPageId: landingPageId })
            
            // Count completed queries (status === "completed")
            const completedQueries = await Query.countDocuments({ 
              landingPageId: landingPageId,
              status: "completed"
            })
            
            // Auto-update status based on query completion:
            // - If all queries completed and status is "fetching", change to "draft"
            // - If queries not all completed and status is "draft", change to "fetching"
            let updatedStatus = itemObj.status
            if (totalQueries > 0) {
              if (completedQueries === totalQueries && itemObj.status === "fetching") {
                // All queries completed, auto-change from "fetching" to "draft"
                await LandingPage.findByIdAndUpdate(landingPageId, { status: "draft" })
                updatedStatus = "draft"
              } else if (completedQueries !== totalQueries && itemObj.status === "draft" && itemObj.status !== "active") {
                // Not all queries completed, change back to "fetching" (but don't change if already "active")
                await LandingPage.findByIdAndUpdate(landingPageId, { status: "fetching" })
                updatedStatus = "fetching"
              }
            }
            
            return {
              ...itemObj,
              status: updatedStatus,
              queryStats: {
                completed: completedQueries,
                total: totalQueries
              }
            }
          } catch (error) {
            console.error(`Error fetching query stats for landing page ${landingPageId}:`, error)
            return {
              ...itemObj,
              queryStats: {
                completed: 0,
                total: 0
              }
            }
          }
        }
        
        return {
          ...itemObj,
          queryStats: {
            completed: 0,
            total: 0
          }
        }
      })
    )

    return NextResponse.json(
      {
        status: 200,
        message: 'Landing pages fetched successfully',
        data: itemsWithQueryStats,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in GET /landing-page:', error)
    return NextResponse.json({ status: 500, message: 'Failed to fetch landing pages' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId') || null

    if (!id) {
      return NextResponse.json({ status: 400, message: 'Landing page ID is required' }, { status: 400 })
    }

    const result = await updateLandingPage(id, body, userId)
    return NextResponse.json(result, { status: result.status })
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Invalid JSON body' }, { status: 500 })
  }
}


