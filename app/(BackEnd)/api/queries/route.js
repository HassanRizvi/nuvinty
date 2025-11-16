import { NextResponse } from 'next/server'
import connectDB from '@/dataBase/db'
import { Query } from '@/dataBase/models/Queries'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const q = (searchParams.get('q') || '').trim()

    const filter = {}
    if (q) {
      Object.assign(filter, { query: { $regex: q, $options: 'i' } })
    }

    const [total, queries] = await Promise.all([
      Query.countDocuments(filter),
      Query.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ])

    return NextResponse.json(
      {
        status: 200,
        message: 'Queries fetched successfully',
        data: queries,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Failed to fetch queries' }, { status: 500 })
  }
}


