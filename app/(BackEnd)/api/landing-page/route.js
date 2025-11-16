import { NextResponse } from 'next/server'
import { createLandingPage } from './landingPageController'
import connectDB from '@/dataBase/db'
import { LandingPage } from '@/dataBase/models/LandingPage'

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

    return NextResponse.json(
      {
        status: 200,
        message: 'Landing pages fetched successfully',
        data: items,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Failed to fetch landing pages' }, { status: 500 })
  }
}


