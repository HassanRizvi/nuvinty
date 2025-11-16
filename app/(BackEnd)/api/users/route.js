import { NextResponse } from 'next/server'
import connectDB from '@/dataBase/db'
import { User } from '@/dataBase/models/Users'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const q = (searchParams.get('q') || '').trim()

    const filter = { role: { $ne: 'admin' } }
    if (q) {
      Object.assign(filter, {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
        ],
      })
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select({ password: 0 }),
    ])

    return NextResponse.json(
      {
        status: 200,
        message: 'Users fetched successfully',
        data: users,
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
    return NextResponse.json({ status: 500, message: 'Failed to fetch users' }, { status: 500 })
  }
}


