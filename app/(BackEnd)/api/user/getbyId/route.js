import { getUser } from "../userController"
import { NextResponse } from "next/server"
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')   
        const response = await getUser({ userId })
        return NextResponse.json(response, { status: response.status })
    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Failed to get user' }, { status: 500 })
    }
}
