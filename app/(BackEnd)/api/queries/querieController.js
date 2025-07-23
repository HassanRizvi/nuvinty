import connectDB from "@/dataBase/db"
import { Query } from "@/dataBase/models/Queries"
import { User } from "@/dataBase/models/Users"

async function checkAdmin(userId) {
    await connectDB();
    const user = await User.findById(userId);
    console.log("user", user)
    if (!user) {
        return { status: 404, message: 'User not found' };
    }
    if (user.role !== 'admin') {
        return { status: 403, message: 'Forbidden: Admins only' };
    }
    return null;
}

async function createQuery(body, userId) {
    const adminCheck = await checkAdmin(userId);
    if (adminCheck) return adminCheck;
    try {
        await connectDB()
        if (Array.isArray(body.query)) {
            // Handle array of queries
            const queries = []
            for (const queryText of body.query) {
                const query = await Query.findOneAndUpdate(
                    { query: queryText },
                    { query: queryText },
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }
                )
                queries.push(query)
            }
            return {
                status: 200,
                message: 'Queries added successfully',
                data: queries
            }
        } else {
            // Handle single query
            const query = await Query.findOneAndUpdate(
                { query: body.query },
                body,
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            )
            return {
                status: 200,
                message: 'Query added successfully',
                data: query
            }
            
        }
    } catch (error) {
        console.log("createQuery error", error)
        throw error
    }
}
async function getAllQueries(userId, filter = {}) {
    const adminCheck = await checkAdmin(userId);
    if (adminCheck) return adminCheck;
    try {
        await connectDB()
        const queries = await Query.find(filter)
        return {
            status: 200,
            message: 'Queries retrieved successfully',
            data: queries
        }
    } catch (error) {
        console.log("getAllQueries error", error)
        throw error
    }
}

async function getQueryById(id, userId) {
    const adminCheck = await checkAdmin(userId);
    if (adminCheck) return adminCheck;
    try {
        await connectDB()
        const query = await Query.findById(id)
        if (!query) {
            return {
                status: 404,
                message: 'Query not found'
            }
        }
        return {
            status: 200,
            message: 'Query retrieved successfully',
            data: query
        }
    } catch (error) {
        console.log("getQueryById error", error)
        throw error
    }
}

async function updateQuery(id, body, userId) {
    const adminCheck = await checkAdmin(userId);
    if (adminCheck) return adminCheck;
    try {
        await connectDB()
        const query = await Query.findByIdAndUpdate(
            id,
            body,
            { new: true }
        )
        if (!query) {
            return {
                status: 404,
                message: 'Query not found'
            }
        }
        return {
            status: 200,
            message: 'Query updated successfully',
            data: query
        }
    } catch (error) {
        console.log("updateQuery error", error)
        throw error
    }
}

async function deleteQuery(id, userId) {
    const adminCheck = await checkAdmin(userId);
    if (adminCheck) return adminCheck;
    try {
        await connectDB()
        const query = await Query.findByIdAndDelete(id)
        if (!query) {
            return {
                status: 404,
                message: 'Query not found'
            }
        }
        return {
            status: 200,
            message: 'Query deleted successfully',
            data: query
        }
    } catch (error) {
        console.log("deleteQuery error", error)
        throw error
    }
}

export { createQuery, getAllQueries, getQueryById, updateQuery, deleteQuery }