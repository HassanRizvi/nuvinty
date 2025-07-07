import connectDB from "@/dataBase/db"
import { Query } from "@/dataBase/models/Queries"

async function createQuery(body) {
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

export { createQuery }