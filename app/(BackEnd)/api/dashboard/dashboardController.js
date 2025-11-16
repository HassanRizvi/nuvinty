import connectDB from "@/dataBase/db"
import { User } from "@/dataBase/models/Users"
import { Product } from "@/dataBase/models/Products"
import { Query } from "@/dataBase/models/Queries"
import { LandingPage } from "@/dataBase/models/LandingPage"

async function getDashboard() {
  try {
    await connectDB()

    const [usersCount, productsCount, queriesCount, landingPagesCount, recentUsers] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Product.countDocuments({}),
      Query.countDocuments({}),
      LandingPage.countDocuments({}),
      User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).limit(10).select({ password: 0 }),
    ])

    return {
      status: 200,
      message: 'Dashboard fetched successfully',
      data: {
        counts: {
          users: usersCount,
          products: productsCount,
          queries: queriesCount,
          landingPages: landingPagesCount,
        },
        recentUsers,
      },
    }
  } catch (error) {
    console.log('getDashboard error', error)
    return { status: 500, message: 'Failed to fetch dashboard' }
  }
}

export { getDashboard }


